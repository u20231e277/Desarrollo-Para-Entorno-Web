import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-credit',
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.css']
})
export class CreditComponent implements OnInit {
  creditForm: FormGroup;
  cardType: string = '';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.creditForm = this.fb.group({
      cardName: ['', [Validators.required, Validators.minLength(3)]],
      cardNumber: ['', [Validators.required, this.cardNumberValidator]],
      expiryDate: ['', [Validators.required, this.expiryDateValidator]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
    });
  }

  ngOnInit(): void {
    // Escuchar cambios en el número de tarjeta para detectar el tipo
    this.creditForm.get('cardNumber')?.valueChanges.subscribe(value => {
      this.cardType = this.detectCardType(value);
    });
  }

  // Validador personalizado para número de tarjeta
  cardNumberValidator(control: any) {
    const value = control.value?.replace(/\s/g, '');
    if (!value) return null;
    
    // Algoritmo de Luhn para validar número de tarjeta
    let sum = 0;
    let shouldDouble = false;
    
    for (let i = value.length - 1; i >= 0; i--) {
      let digit = parseInt(value.charAt(i));
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0 ? null : { invalidCardNumber: true };
  }

  // Validador personalizado para fecha de expiración
  expiryDateValidator(control: any) {
    const value = control.value;
    if (!value) return null;
    
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(value)) {
      return { invalidExpiryFormat: true };
    }
    
    const [month, year] = value.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expYear = parseInt(year);
    const expMonth = parseInt(month);
    
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return { expiredCard: true };
    }
    
    return null;
  }

  // Detectar tipo de tarjeta basado en el número
  detectCardType(cardNumber: string): string {
    const number = cardNumber.replace(/\s/g, '');
    
    if (number.match(/^4/)) return 'visa';
    if (number.match(/^5[1-5]/)) return 'mastercard';
    if (number.match(/^3[47]/)) return 'amex';
    if (number.match(/^6(?:011|5)/)) return 'discover';
    
    return '';
  }

  // Formatear número de tarjeta con espacios
  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = '';
    
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += value[i];
    }
    
    event.target.value = formattedValue;
    this.creditForm.get('cardNumber')?.setValue(value);
  }

  // Formatear fecha de expiración
  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    event.target.value = value;
    this.creditForm.get('expiryDate')?.setValue(value);
  }

  // Solo permitir números en CVV
  onCvvInput(event: any): void {
    const value = event.target.value.replace(/\D/g, '');
    event.target.value = value;
    this.creditForm.get('cvv')?.setValue(value);
  }

  // Obtener mensaje de error
  getErrorMessage(fieldName: string): string {
    const field = this.creditForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} es requerido`;
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} debe tener al menos 3 caracteres`;
      if (field.errors['invalidCardNumber']) return 'Número de tarjeta inválido';
      if (field.errors['invalidExpiryFormat']) return 'Formato debe ser MM/YY';
      if (field.errors['expiredCard']) return 'La tarjeta ha expirado';
      if (field.errors['pattern']) return 'CVV debe tener 3 o 4 dígitos';
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      cardName: 'Nombre en la tarjeta',
      cardNumber: 'Número de tarjeta',
      expiryDate: 'Fecha de expiración',
      cvv: 'CVV'
    };
    return labels[fieldName] || fieldName;
  }

  // Verificar si un campo es válido
  isFieldValid(fieldName: string): boolean {
    const field = this.creditForm.get(fieldName);
    return field ? field.valid && field.touched : false;
  }

  // Verificar si un campo es inválido
  isFieldInvalid(fieldName: string): boolean {
    const field = this.creditForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  // Obtener icono de tarjeta
  getCardIcon(): string {
    const icons: { [key: string]: string } = {
      visa: 'fab fa-cc-visa',
      mastercard: 'fab fa-cc-mastercard',
      amex: 'fab fa-cc-amex',
      discover: 'fab fa-cc-discover'
    };
    return icons[this.cardType] || 'fas fa-credit-card';
  }

  // Mostrar número de tarjeta formateado
  getDisplayCardNumber(): string {
    const cardNumber = this.creditForm.get('cardNumber')?.value || '';
    if (!cardNumber) return '•••• •••• •••• ••••';
    
    const cleanNumber = cardNumber.replace(/\s/g, '');
    const maskedNumber = cleanNumber.replace(/\d(?=\d{4})/g, '•');
    return maskedNumber.replace(/(.{4})/g, '$1 ').trim();
  }

  // Enviar formulario
  onSubmit(): void {
    if (this.creditForm.valid) {
      this.isSubmitting = true;
      
      // Simular procesamiento
      setTimeout(() => {
        console.log('Datos de tarjeta:', this.creditForm.value);
        this.router.navigate(['/confirm']);
        this.isSubmitting = false;
      }, 2000);
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.creditForm.controls).forEach(key => {
        this.creditForm.get(key)?.markAsTouched();
      });
    }
  }
}