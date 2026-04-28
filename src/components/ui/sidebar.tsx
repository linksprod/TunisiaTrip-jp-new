
"use client"

import * as React from "react"
import { createContext, useContext, useState } from "react"
import { cn } from "@/lib/utils"

/* ----------------- Sidebar Context ----------------- */
type SidebarContextValue = {
  expanded: boolean
  setExpanded: (expanded: boolean) => void
  toggleExpanded: () => void
}

const SidebarContext = createContext<SidebarContextValue | undefined>(
  undefined
)

export function SidebarProvider({
  children,
  defaultExpanded = true,
}: {
  children: React.ReactNode
  defaultExpanded?: boolean
}) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const toggleExpanded = () => setExpanded((prev) => !prev)

  return (
    <SidebarContext.Provider
      value={{
        expanded,
        setExpanded,
        toggleExpanded,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider")
  }
  return context
}

/* ----------------- Sidebar Component ----------------- */
export function Sidebar({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const { expanded } = useSidebar()

  return (
    <div
      className={cn(
        "h-full sticky hidden w-full flex-none transition-all lg:flex",
        expanded ? "lg:w-64" : "lg:w-16",
        className
      )}
      style={{
        top: "0",
      }}
    >
      <aside className="top-0 z-30 h-full w-full flex-col bg-background shadow-sm border-r border-gray-100">
        <nav className="flex flex-col h-full">
          {children}
        </nav>
      </aside>
    </div>
  )
}

/* ----------------- Sidebar Header ----------------- */
export function SidebarHeader({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const { expanded } = useSidebar()

  return (
    <div
      className={cn(
        "flex h-16 items-center px-4 border-b",
        expanded ? "justify-between" : "justify-center",
        className
      )}
    >
      {children}
    </div>
  )
}

/* ----------------- Sidebar Content ----------------- */
export function SidebarContent({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return <div className={cn("grow overflow-y-auto p-4", className)}>{children}</div>
}

/* ----------------- Sidebar Footer ----------------- */
export function SidebarFooter({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return <div className={cn("mt-auto p-4 border-t", className)}>{children}</div>
}

/* ----------------- Sidebar Group ----------------- */
export function SidebarGroup({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return <div className={cn("mb-6", className)}>{children}</div>
}

export function SidebarGroupLabel({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const { expanded } = useSidebar()
  if (!expanded) {
    return null
  }

  return (
    <div className={cn("mb-2 px-2", className)}>
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {children}
      </div>
    </div>
  )
}

export function SidebarGroupContent({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return <div className={cn("space-y-1", className)}>{children}</div>
}

/* ----------------- Sidebar Menu ----------------- */
export function SidebarMenu({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return <div className={cn("px-2", className)}>{children}</div>
}

export function SidebarMenuItem({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return <div className={cn("block", className)}>{children}</div>
}

export function SidebarMenuButton({
  className,
  asChild,
  children,
  ...props
}: {
  className?: string
  asChild?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { expanded } = useSidebar()
  const baseClasses = "flex h-10 w-full cursor-pointer items-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900"

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(baseClasses, className, (children.props as any).className),
      ...props
    } as any)
  }

  return (
    <button
      className={cn(baseClasses, className)}
      {...props}
    >
      {children}
    </button>
  )
}

/* ----------------- Sidebar Trigger ----------------- */
export function SidebarTrigger() {
  const { toggleExpanded } = useSidebar()

  return (
    <button
      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 absolute left-0 top-[10px] lg:hidden z-50"
      onClick={toggleExpanded}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <line x1="4" x2="20" y1="12" y2="12"></line>
        <line x1="4" x2="20" y1="6" y2="6"></line>
        <line x1="4" x2="20" y1="18" y2="18"></line>
      </svg>
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  )
}
