"use client";
import React from "react";
// cleaned unused imports
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton,
} from "@/components/ui/resizable-navbar";

export function Navigation() {
  const [open, setOpen] = React.useState(false);

  const items = [
    { name: "Find Jobs", link: "#jobs" },
    { name: "Companies", link: "#companies" },
    { name: "Salaries", link: "#salaries" },
    { name: "Career Advice", link: "#careers" },
  ];

  return (
    <Navbar className="top-4">
      <NavBody className="!rounded-3xl !border border-border !bg-background/80 dark:!bg-background/80">
        <div className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">X</span>
          </div>
          <span className="font-elegant-thin text-xl text-foreground">JobSearch</span>
        </div>

        {/* Reserve horizontal space so centered nav items don't collide with logo/actions */}
        <NavItems items={items} className="pl-36 pr-40 xl:pl-44 xl:pr-52" />

        <div className="hidden items-center space-x-4 lg:flex">
          <NavbarButton as="a" href="/signin" className="border-border" variant="secondary">
            Sign In
          </NavbarButton>
          <NavbarButton as="a" href="/signup" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Sign Up
          </NavbarButton>
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <div className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">X</span>
            </div>
            <span className="font-elegant-thin text-xl text-foreground">JobSearch</span>
          </div>

          <button className="rounded-full border border-border p-2" onClick={() => setOpen(!open)}>
            <MobileNavToggle isOpen={open} onClick={() => setOpen(!open)} />
          </button>
        </MobileNavHeader>

        <MobileNavMenu isOpen={open} onClose={() => setOpen(false)}>
          <div className="flex w-full flex-col gap-2">
            {items.map((it) => (
              <a key={it.link} href={it.link} className="px-2 py-2 text-sm text-foreground" onClick={() => setOpen(false)}>
                {it.name}
              </a>
            ))}
                  </div>
          <div className="mt-4 flex w-full flex-col gap-2">
            <NavbarButton as="a" href="/signin" className="w-full border border-border" variant="secondary">
              Sign In
            </NavbarButton>
            <NavbarButton as="a" href="/signup" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Sign Up
            </NavbarButton>
            </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
