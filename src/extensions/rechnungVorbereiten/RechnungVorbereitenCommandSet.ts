import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { override } from "@microsoft/decorators";
import { Log } from "@microsoft/sp-core-library";
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetExecuteEventParameters,
  ListViewStateChangedEventArgs,
} from "@microsoft/sp-listview-extensibility";
import { Dialog } from '@microsoft/sp-dialog';

const LOG_SOURCE: string = "RechnungVorbereitenCommandSet";

interface DetailsListWithEvents extends HTMLElement {
  __events: {
    selection: {
      setAllSelected: (selected: boolean) => void;
    };
  };
}

// Properties aus emelents.xml (serve.json) bereitstellen
export interface IRechnungVorbereitenCommandSetProperties {
  ListID?: string;
  DialogText?: string;
  FlowURL?: string;
}

interface ItemResponse {
  value: Array<{
    value: string;
  }>;
}

export default class RechnungVorbereitenCommandSet extends BaseListViewCommandSet<IRechnungVorbereitenCommandSetProperties> {
  
  private getConfiguration(key: string): Promise<string> {
    return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('SPFX_RechnungVorbereiten_Konfiguration')/items?$filter=key eq '${key}'`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json().then((items: ItemResponse) => {
          if (items.value && items.value.length > 0) {
            return items.value[0].value;
          }
          return null;
        });
      });
  }
    
  @override
  public onInit(): Promise<void> {
    return Promise.all([
      this.getConfiguration('FlowURL'),
      this.getConfiguration('ListID'),
      this.getConfiguration('DialogText')
    ]).then(([flowUrl, listId, dialogText]) => {
      this.properties.FlowURL = flowUrl;
      this.properties.ListID = listId;
      this.properties.DialogText = dialogText;
    }).then(() => {
      // Original Code
      Log.info(LOG_SOURCE, "Initialized RechnungVorbereitenCommandSet");
  
      const compareOneCommand: Command = this.tryGetCommand(
        "RECHNUNG_VORBEREITEN"
      );
      compareOneCommand.visible = false;
  
      this.context.listView.listViewStateChangedEvent.add(
        this,
        this._onListViewStateChanged
      );
  
      return super.onInit();
    });
  }

  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case "RECHNUNG_VORBEREITEN": {
        console.log(`Rechnung vorbereiten ...`);
        const selectedRows = this.context.listView.selectedRows;
        const itemIds: number[] = selectedRows.map((row) =>
          Number(row.getValueByName("ID"))
        );
        // eslint-disable-next-line no-void
        void this._sendItemIdsToFlow(itemIds);
        break;
      }
      default:
        throw new Error("Unknown command");
    }
  }

  @override
  private async _sendItemIdsToFlow(itemIds: number[]): Promise<void> {
    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemIds: itemIds }),
    };

    try {
      const response = await fetch(this.properties.FlowURL, requestOptions);
      if (!response.ok) {
        throw new Error("Error sending item IDs to Flow");
      }
      // Erfolgreiche Übertragung an den Flow

      // Zeilenauswahl aufheben
      const detailsList = document.querySelector(".sp-List .ms-DetailsList") as DetailsListWithEvents;
      if (detailsList) {
        const selection = detailsList.__events.selection;
        if (selection) {
          selection.setAllSelected(false);
        }
      }
            
      // Erfolgsdialog anzeigen
      this._showSuccessDialog();
      
    } catch (error) {
      console.error("Error:", error);
    }
  }

  private _onListViewStateChanged = (
    args: ListViewStateChangedEventArgs
  ): void => {
    Log.info(LOG_SOURCE, "List view state changed");
  
    const compareOneCommand: Command = this.tryGetCommand(
      "RECHNUNG_VORBEREITEN"
    );
    if (compareOneCommand) {
      // This command should be hidden unless exactly one row is selected and the current list ID matches the desired list ID.
      compareOneCommand.visible =
        this.context.listView.selectedRows?.length > 0 &&
        this.context.pageContext.list.id.toString() === this.properties.ListID;
    }
  
    // You should call this.raiseOnChange() to update the command bar
    this.raiseOnChange();
  };
  
  private _showSuccessDialog(): void {
    // const message = "Der Flow wurde gestartet.";
    Dialog.alert(this.properties.DialogText).catch((error) => {
      console.error("Error showing success dialog:", error);
    });
  }

}
