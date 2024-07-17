export interface Tab {
  id: string;
  title: string;
  active: boolean;
  added_components: any[];
}

export interface IComponent {
  id: string;
  activeTabId:string | null;
  isSelected:boolean;
  name: string;
  icon: string;
  position: { x: number; y: number };
  gridComponent:any[],
  element:any[]
}
