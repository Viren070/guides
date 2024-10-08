import { KoFiDialog, KoFiButton, KoFiWidget, KoFiPanel } from "react-kofi";
import "react-kofi/dist/styles.css";

export default function KoFiWrapper(props: { widgetType: string }) {
  const { widgetType } = props;
  switch (widgetType) {
    case "dialog":
      return <KoFiDialog id="Viren070"/>;
    case "button":
      return <KoFiButton id="Viren070" />;
    case "widget":
      return <KoFiWidget id="Viren070" />;
    case "panel":
      return <KoFiPanel id="Viren070" />;
    default:
      return null;
  }
}