import { KoFiDialog, KoFiButton, KoFiWidget, KoFiPanel } from "react-kofi";
import "react-kofi/dist/styles.css";
import { translate } from "@docusaurus/Translate";
export default function KoFiWrapper(props: { widgetType: string }) {
  const { widgetType } = props;
  switch (widgetType) {
    case "button":
      return <KoFiButton id="Viren070" 
        label={
          translate({
            "message": "Support me on Ko-fi",
            "id": "kofi.button.label.full",
            "description": "The full label for the Ko-fi button"
          })
        }
      />;
    case "widget":
      return <KoFiWidget id="Viren070" 
        label={
          translate({
            "message": "Support me",
            "id": "kofi.widget.label.short",
            "description": "The short label for the Ko-fi widget"
          })
        }
      />;
    default:
      return null;
  }
}