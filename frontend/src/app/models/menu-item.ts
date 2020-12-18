export class MenuItem {
  title: string;
  isHeading: boolean;
  isActive: boolean;
  link: string;
  className: string;
  isIconClass: boolean;
  icon: string;
  children: MenuItem[];
  append?: string;
}
