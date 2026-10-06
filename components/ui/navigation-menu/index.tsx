import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { cn } from "cn";
import { NavigationMenuPositioner } from "./components/navigation-menu-positioner";
export const NavigationMenu = ({
  align = "start",
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Root.Props &
  Pick<NavigationMenuPrimitive.Positioner.Props, "align">) => {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
      <NavigationMenuPositioner align={align} />
    </NavigationMenuPrimitive.Root>
  );
};
export { NavigationMenuContent } from "./components/navigation-menu-content";
export { NavigationMenuIndicator } from "./components/navigation-menu-indicator";
export { NavigationMenuItem } from "./components/navigation-menu-item";
export { NavigationMenuLink } from "./components/navigation-menu-link";
export { NavigationMenuList } from "./components/navigation-menu-list";
export { NavigationMenuTrigger } from "./components/navigation-menu-trigger";
export { navigationMenuTriggerStyle } from "./constants";
export { NavigationMenuPositioner } from "./components/navigation-menu-positioner";
