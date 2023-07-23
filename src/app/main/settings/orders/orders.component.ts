import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';
import { User } from 'src/app/models/user';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] | undefined
  staffs: User[] | undefined

  ngOnInit(): void {
    // let order = this.orderSrv.getOrderByUserId('64bbe4d6842cf4dbd2e26f09');
    this.orderSrv.GetAll().subscribe(result => {
      const orderStore = result.data;

      let orders: Order[] = orderStore.filter((item: Order) => item.userId === '64bbe4d6842cf4dbd2e26f09');
      orders.forEach((item: Order) => {
        item.createdAt = item.createdAt.slice(0, 10)
        item.dateWork = item.dateWork.slice(0, 10)
      })
      this.orders = orders;

      console.warn(orders)
    })
  }

  constructor(private orderSrv: OrderService) { }

}
