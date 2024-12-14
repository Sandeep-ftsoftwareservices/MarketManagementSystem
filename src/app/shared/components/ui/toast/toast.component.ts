import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit {
  toastClass = ['toast-class'];
  toastMessage = 'This is a toast';
  showsToast = false;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.showsToast = true;
    }, 1000)
  }
}
