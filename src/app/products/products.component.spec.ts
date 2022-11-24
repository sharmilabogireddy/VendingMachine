import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductsComponent } from './products.component';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatRadioModule} from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, By } from '@angular/platform-browser';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatRadioModule
      ],
      declarations: [ ProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Restock form testing
   */
  describe("Restock form suite", function() {
    it('should mark restock as invalid when it has no value', () => {
      const restockControl = component.restockForm.get("restock");
      restockControl?.setValue(null);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(restockControl?.invalid).toBeTruthy();
      });
    });

    it('should mark restock as valid when it has positive number', () => {
      const restockControl = component.restockForm.get("restock");
      restockControl?.setValue(2);
      fixture.detectChanges();
      
      fixture.whenStable().then(() => {
        expect(restockControl?.valid).toBeTruthy();
      });
    });

    it('should mark restock as invalid when it has negitive number', () => {
      const restockControl = component.restockForm.get("restock");
      restockControl?.setValue(-2);
      fixture.detectChanges();
      
      fixture.whenStable().then(() => {
        expect(restockControl?.invalid).toBeTruthy();
      });
    });
  });
  /**
   * Payment form testing
   */
   describe("Payment form suite", function() {
    it('should mark paymentType as invalid when it has no value', () => {
      const paymentControl = component.paymentForm.get("payment");
      paymentControl?.setValue(null);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(paymentControl?.invalid).toBeTruthy();
      });
    });

    it('should mark paymentType as valid when Cash choosen', () => {
      const paymentControl = component.paymentForm.get("payment");
      paymentControl?.setValue('Cash');
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(paymentControl?.valid).toBeTruthy();
      });
    });
  });
  /**
   * Restock functionality testing
   */
   describe("Restock functionality suite", function() {
    it('should have called restock method when submit', () => {
      const restockFun = spyOn(component, 'restock');
      const restockControl = component.restockForm.get('restock');
      restockControl?.setValue(5);

      fixture.debugElement
        .query(By.css(`[id="restockForm"]`))
        .triggerEventHandler('ngSubmit', null);

      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(restockFun).toHaveBeenCalledTimes(1);
      });
    });

    it('should add restock number to the total available cans', () => {
      const restockControl = component.restockForm.get('restock');
      restockControl?.setValue(5);

      fixture.debugElement
        .query(By.css(`[id="restockForm"]`))
        .triggerEventHandler('ngSubmit', null);

      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(component.totalAvailable).toEqual(105);
      });
    });

    it('should reset to zero for cash payments, card payments and sold cans when restock', () => {
      const restockControl = component.restockForm.get('restock');
      restockControl?.setValue(5);

      fixture.debugElement
        .query(By.css(`[id="restockForm"]`))
        .triggerEventHandler('ngSubmit', null);

      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(component.totalSold).toEqual(0);
        expect(component.card).toEqual(0);
        expect(component.cash).toEqual(0);
      });
    });
  });
  /**
   * Cash Payment functionality testing
   */
   describe("Cash Payment functionality suite", function() {
    it('should add payment amount to total cash available when paid with cash', () => {
      component.CAN_PRICE = 2.00;
      component.cash = 5.00;

      fixture.debugElement
        .query(By.css(".mat-button-toggle-button"))
        .triggerEventHandler('click', null);
      fixture.detectChanges();

      const paymentControl = component.paymentForm.get('payment');
      paymentControl?.setValue('Cash');

      fixture.debugElement
        .query(By.css("#paymentForm"))
        .triggerEventHandler('ngSubmit', null);

      fixture.detectChanges();
      expect(component.cash).toBe(7.00);
    });
    it('should not add payment amount to card amount when paid with cash', () => {
      component.CAN_PRICE = 2.00;
      component.cash = 5.00;

      fixture.debugElement
        .query(By.css(".mat-button-toggle-button"))
        .triggerEventHandler('click', null);
      fixture.detectChanges();

      const paymentControl = component.paymentForm.get('payment');
      paymentControl?.setValue('Cash');

      fixture.debugElement
        .query(By.css("#paymentForm"))
        .triggerEventHandler('ngSubmit', null);

      fixture.detectChanges();
      expect(component.card).toEqual(0);
    });
    it('should increase total sold cans when paid with cash', () => {
      component.CAN_PRICE = 2.00;
      component.cash = 5.00;

      fixture.debugElement
        .query(By.css(".mat-button-toggle-button"))
        .triggerEventHandler('click', null);
      fixture.detectChanges();

      const paymentControl = component.paymentForm.get('payment');
      paymentControl?.setValue('Cash');

      fixture.debugElement
        .query(By.css("#paymentForm"))
        .triggerEventHandler('ngSubmit', null);

      fixture.detectChanges();
      expect(component.totalSold).toEqual(1);
    });
    it('should decrease total available cans when paid with cash', () => {
      component.totalAvailable = 10;
      component.CAN_PRICE = 2.00;
      component.cash = 5.00;

      fixture.debugElement
        .query(By.css(".mat-button-toggle-button"))
        .triggerEventHandler('click', null);
      fixture.detectChanges();

      const paymentControl = component.paymentForm.get('payment');
      paymentControl?.setValue('Cash');

      fixture.debugElement
        .query(By.css("#paymentForm"))
        .triggerEventHandler('ngSubmit', null);

      fixture.detectChanges();
      expect(component.totalAvailable).toEqual(9);
    });
  });
  /**
   * Card Payment functionality testing
   */
   describe("Card Payment functionality suite", function() {
    it('should add payment amount to card amount when paid with card', () => {
      component.CAN_PRICE = 2.00;
      component.card = 5.00;

      fixture.debugElement
        .query(By.css(".mat-button-toggle-button"))
        .triggerEventHandler('click', null);
      fixture.detectChanges();

      const paymentControl = component.paymentForm.get('payment');
      paymentControl?.setValue('Card');

      fixture.debugElement
        .query(By.css("#paymentForm"))
        .triggerEventHandler('ngSubmit', null);

      fixture.detectChanges();
      expect(component.card).toBe(7.00);
    });
    it('should not add payment amount to cash amount when paid with card', () => {
      component.CAN_PRICE = 2.00;
      component.card = 5.00;

      fixture.debugElement
        .query(By.css(".mat-button-toggle-button"))
        .triggerEventHandler('click', null);
      fixture.detectChanges();

      const paymentControl = component.paymentForm.get('payment');
      paymentControl?.setValue('Card');

      fixture.debugElement
        .query(By.css("#paymentForm"))
        .triggerEventHandler('ngSubmit', null);

      fixture.detectChanges();
      expect(component.cash).toEqual(0);
    });
    it('should increase total sold cans when paid with card', () => {
      component.CAN_PRICE = 2.00;
      component.card = 5.00;

      fixture.debugElement
        .query(By.css(".mat-button-toggle-button"))
        .triggerEventHandler('click', null);
      fixture.detectChanges();

      const paymentControl = component.paymentForm.get('payment');
      paymentControl?.setValue('Card');

      fixture.debugElement
        .query(By.css("#paymentForm"))
        .triggerEventHandler('ngSubmit', null);

      fixture.detectChanges();
      expect(component.totalSold).toEqual(1);
    });
    it('should decrease total available cans when paid with card', () => {
      component.totalAvailable = 10;
      component.CAN_PRICE = 2.00;
      component.card = 5.00;

      fixture.debugElement
        .query(By.css(".mat-button-toggle-button"))
        .triggerEventHandler('click', null);
      fixture.detectChanges();

      const paymentControl = component.paymentForm.get('payment');
      paymentControl?.setValue('Card');

      fixture.debugElement
        .query(By.css("#paymentForm"))
        .triggerEventHandler('ngSubmit', null);

      fixture.detectChanges();
      expect(component.totalAvailable).toEqual(9);
    });
  });
});
