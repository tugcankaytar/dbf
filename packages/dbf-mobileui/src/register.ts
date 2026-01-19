import { defineMobileButton } from "./components/button";
import { defineMobileCard } from "./components/card";
import { defineMobileDrawer } from "./components/drawer";
import { defineMobileDrawerItem } from "./components/drawer-item";
import { defineMobileInput } from "./components/input";
import { defineMobileLink } from "./components/link";
import { defineMobileList } from "./components/list";
import { defineMobileListItem } from "./components/list-item";
import { defineMobileNavbar } from "./components/navbar";
import { defineMobileToolbar } from "./components/toolbar";
import { defineMobilePage } from "./layout/page";

export function registerMobileUI() {
  defineMobileButton();
  defineMobileCard();
  defineMobileDrawer();
  defineMobileDrawerItem();
  defineMobileInput();
  defineMobileLink();
  defineMobileList();
  defineMobileListItem();
  defineMobileNavbar();
  defineMobileToolbar();
  defineMobilePage();
}
