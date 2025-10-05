"use client"

import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"

import { cn } from "@/lib/utils"

function Drawer({ ...props }: React.ComponentProps<typeof Dialog.Root>) {
  return <Dialog.Root {...props} />
}

function DrawerTrigger({ ...props }: React.ComponentProps<typeof Dialog.Trigger>) {
  return <Dialog.Trigger {...props} />
}

function DrawerPortal({ ...props }: React.ComponentProps<typeof Dialog.Portal>) {
  return <Dialog.Portal {...props} />
}

function DrawerClose({ ...props }: React.ComponentProps<typeof Dialog.Close>) {
  return <Dialog.Close {...props} />
}

function DrawerOverlay({ className, ...props }: React.ComponentProps<typeof Dialog.Overlay>) {
  return (
    <Dialog.Overlay
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className,
      )}
      {...props}
    />
  )
}

function DrawerContent({ className, children, ...props }: React.ComponentProps<typeof Dialog.Content>) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <Dialog.Content
        className={cn(
          "group/drawer-content bg-background fixed z-50 flex h-auto flex-col",
          // keep original vaul direction-based classes but without vaul prefix
          "data-[drawer-direction=top]:inset-x-0 data-[drawer-direction=top]:top-0 data-[drawer-direction=top]:mb-24 data-[drawer-direction=top]:max-h-[80vh] data-[drawer-direction=top]:rounded-b-lg data-[drawer-direction=top]:border-b",
          "data-[drawer-direction=bottom]:inset-x-0 data-[drawer-direction=bottom]:bottom-0 data-[drawer-direction=bottom]:mt-24 data-[drawer-direction=bottom]:max-h-[80vh] data-[drawer-direction=bottom]:rounded-t-lg data-[drawer-direction=bottom]:border-t",
          "data-[drawer-direction=right]:inset-y-0 data-[drawer-direction=right]:right-0 data-[drawer-direction=right]:w-3/4 data-[drawer-direction=right]:border-l data-[drawer-direction=right]:sm:max-w-sm",
          "data-[drawer-direction=left]:inset-y-0 data-[drawer-direction=left]:left-0 data-[drawer-direction=left]:w-3/4 data-[drawer-direction=left]:border-r data-[drawer-direction=left]:sm:max-w-sm",
          className,
        )}
        {...props}
      >
        <div className="bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[drawer-direction=bottom]/drawer-content:block" />
        {children}
      </Dialog.Content>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 p-4 group-data-[drawer-direction=bottom]/drawer-content:text-center group-data-[drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left",
        className,
      )}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />
  )
}

function DrawerTitle({ className, ...props }: React.ComponentProps<typeof Dialog.Title>) {
  return <Dialog.Title className={cn('text-foreground font-semibold', className)} {...props} />
}

function DrawerDescription({ className, ...props }: React.ComponentProps<typeof Dialog.Description>) {
  return <Dialog.Description className={cn('text-muted-foreground text-sm', className)} {...props} />
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
