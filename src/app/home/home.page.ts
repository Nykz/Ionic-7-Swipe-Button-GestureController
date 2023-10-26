import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GestureController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('swipeButton', { read: ElementRef }) swipeButton!: ElementRef;
  color = 'primary';
  text = 'Swipe';

  swipeInProgress = false;
  colWidth!: number;
  translateX!: number;

  swipeGesture!: any;

  constructor(
    private gestureCtrl: GestureController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.createSwipeGesture();
  }

  private createSwipeGesture() {
    this.swipeGesture = this.gestureCtrl.create({
      el: this.swipeButton.nativeElement,
      threshold: 10,
      gestureName: 'swipe',
      onStart: () => {
        // Handle the start of the swipe gesture if needed
        this.swipeInProgress = true;
      },
      onMove: (detail) => {
        if (this.swipeInProgress && detail.deltaX > 0) {
          const deltaX = detail.deltaX;
          console.log('deltax: ', deltaX);
          const colWidth = this.swipeButton.nativeElement.parentElement.clientWidth;
          this.colWidth = colWidth - (15 / 100 * colWidth); 
          console.log('colWidth: ', this.colWidth);
          this.translateX = Math.min(deltaX, this.colWidth);
          console.log('translatex: ', this.translateX);
          this.swipeButton.nativeElement.style.transform = `translateX(${this.translateX}px)`;
        }
      },
      onEnd: (detail) => {
        if(this.translateX >= this.colWidth) {
          console.log('swiped');
          // this.changeText();
          this.showToast();
        }
        this.swipeInProgress = false;
        this.swipeButton.nativeElement.style.transform = 'translateX(0)';
      },
    });
    this.swipeGesture.enable(true);
  }

  async changeText() {
    this.text = 'Swiped';
    this.color = 'success';
    await this.delay(800);
    this.text = 'Swipe';
    this.color = 'primary';
  }

  async showToast() {
    const toast = await this.toastCtrl.create({
      message: 'Swipe',
      duration: 3000,
      color: 'success',
      position: 'middle'
    });
    toast.present();
  }
  
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // @HostListener('touchstart', ['$event'])
  // onTouchStart(event: TouchEvent) {
  //   this.swipeInProgress = true;
  // }

  // @HostListener('touchmove', ['$event'])
  // onTouchMove(event: TouchEvent) {
  //   if (this.swipeInProgress) {
  //     const deltaX = event.touches[0].clientX;
  //     console.log('deltax: ', deltaX);
  //     this.colWidth = this.swipeButton.nativeElement.parentElement.clientWidth;
  //     console.log('colWidth: ', this.colWidth);
  //     this.translateX = Math.min(deltaX, this.colWidth);
  //     console.log('translatex: ', this.translateX);
  //     this.swipeButton.nativeElement.style.transform = `translateX(${this.translateX}px)`;
  //   }
  // }

  // @HostListener('touchend', ['$event'])
  // async onTouchEnd(event: TouchEvent) {
  //   console.log(event);
  //   if(this.translateX == this.colWidth) {
  //     console.log('swiped');
  //     this.text = 'Swiped';
  //     this.color = 'success';
  //     await this.delay(800);
  //     this.text = 'Swipe';
  //     this.color = 'primary';
  //   }
  //   this.swipeInProgress = false;
  //   this.swipeButton.nativeElement.style.transform = 'translateX(0)';
  // }

}
