import { Component, OnInit } from '@angular/core';
import {FormsModule, FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import { NgForm } from '@angular/forms';

interface Product {
  id: number;
  name: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
  CAN_PRICE: number = 1.50;
  TOTAL_CANS: number = 100;
  totalAvailable: number = 100;
  totalSold: number = 0;
  cash: number = 0;
  card: number = 0;
  products: Product[] =[
    {id: 2,name: 'Flavour1'},
    {id: 2,name: 'Flavour2'},
    {id: 3,name: 'Flavour3'},
    {id: 4,name: 'Flavour4'},
    {id: 5,name: 'Flavour5'},
    {id: 6,name: 'Flavour6'},
    {id: 7,name: 'Flavour7'},
    {id: 8,name: 'Flavour8'},
    {id: 9,name: 'Flavour9'},
    {id: 10,name: 'Flavour10'}
  ];
  selected: any;
  
  restockForm: FormGroup;
  paymentForm: FormGroup;
  restockSubmitted = false;
  paymentSubmitted = false;
  

  constructor(private formBuilder: FormBuilder) {
    
    //Restrock input field should be required,the value should not be less than or equal 0 and it cannot be null
    this.restockForm = this.formBuilder.group({
      restock: ['', [Validators.required, Validators.min(1)]]
    });

    //Have to select cash or card
    this.paymentForm = this.formBuilder.group({
      payment: ['', [Validators.required]]
    });
  }

  //This returns the restock form controls
  get f() {
    return this.restockForm.controls;
  }

  //This returns the payment form controls
  get paymentControl() {
    return this.paymentForm.controls;
  }

  ngOnInit(): void {
    
  }

  //To do payment for a can
  payment(){
    this.paymentSubmitted = true;
    if(this.paymentForm.invalid) {
      return;
    }
    //If payment is Cash selected then the amount is added to Total Cash Payments
    if(this.paymentForm.value.payment == "Cash"){
      this.cash += this.CAN_PRICE;
    }
    //If payment is Card selected then the amount is added to Total Card Payments
    else{
      this.card+=this.CAN_PRICE;
    }
    this.totalAvailable--;
    this.totalSold++;
    this.paymentForm.reset();
    this.selected = undefined;
    this.paymentSubmitted = false;
  }

  //To restock the total available Cans
  //When restocking the available cans, card amount is reset to 0, cash amount is reset to 0, and total sold cans will reset to 0
  restock() {
    this.restockSubmitted = true;
    if(this.restockForm.invalid) {
      return;
    }

    this.card = 0;
    this.cash = 0;
    this.totalSold = 0;
    this.totalAvailable += this.restockForm.value.restock;
    this.restockForm.reset(); //The form will reset
    Object.keys(this.restockForm.controls).forEach(key =>{
      this.restockForm.controls[key].setErrors(null)
   });
    this.restockSubmitted = false;
  }

}
