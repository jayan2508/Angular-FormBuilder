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
  element:{
    width:number | string;
    height:number | string;
    alignment:string;
    background:string;
    padding:number | string;
    // margin:number;
    font:string;
    roundedCorners:number | string;
    border:number | string;
    borderColor:string;
  }
}

export interface IElement{
  width:number;
  height:number;
  alignment:string;
  background:string;
  padding:number;
  margin:number;
  font:string;
  roundedCorners:number;
  border:number;
  borderColor:string;
}