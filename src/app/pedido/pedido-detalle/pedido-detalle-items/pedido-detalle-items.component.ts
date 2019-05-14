import { Component, HostListener, OnInit, OnDestroy } from "@angular/core";
import { Item } from "src/app/pedido/item";
import { Pedido, PedidoBuilder } from "src/app/pedido/pedido";
import { PedidoService } from "src/app/pedido/pedido.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-pedido-detalle-items",
  templateUrl: "./pedido-detalle-items.component.html",
  styleUrls: ["./pedido-detalle-items.component.scss"],
})
export class PedidoDetalleItemsComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription;
  pedido: Pedido;
  height: number;

  constructor(private pedidoService: PedidoService) {
    this.subscriptions = new Subscription();
  }

  ngOnInit() {
    this.pedido = new PedidoBuilder().build();
    this.pedido.items = new Array<Item>();
    this.subscriptions.add(this.pedidoService.pedido$.subscribe((pedido) => {
      this.pedido = pedido ? pedido : new PedidoBuilder().withItems([]).build();
    }));
    this.calculateHeight();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  @HostListener("window:orientationchange", ["$event"])
  onChangeOrientation(event?) {
    this.calculateHeight();
  }

  @HostListener("window:resize", ["$event"])
  onResizedDisplay(event?) {
    this.calculateHeight();
  }

  calculateHeight(): void {
    const width: number = window.innerWidth;
    const height: number = window.innerHeight;
    const orientation: string = width > height ? "landscape" : "portrait";
    if (orientation === "landscape") {
      const screenHeight = window.innerHeight;
      const height: number = screenHeight - (48 + 48 + 54);
      this.height = height * 0.7;
    } else {
      const screenWidth = window.innerWidth;
      const height: number = screenWidth - (48 + 48 + 54);
      this.height = height * 0.7;
    }
  }
}
