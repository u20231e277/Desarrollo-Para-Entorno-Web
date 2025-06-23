import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @ViewChild('menuIcon') menuIcon!: ElementRef;
  @ViewChild('nav') nav!: ElementRef;

  toggleNav(open: boolean): void {
    const navEl = this.nav.nativeElement;
    const menuIconEl = this.menuIcon.nativeElement;

    if (open) {
      navEl.classList.add('active');
      menuIconEl.style.display = 'none';
    } else {
      navEl.classList.remove('active');
      menuIconEl.style.display = 'block';
    }
  }
}
