import { Subject } from 'rxjs';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Injectable, NgZone } from '@angular/core';
import { CustomSnackbarComponent } from '../components/custom-snackbar/custom-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  private configSuccess: MatSnackBarConfig = {
    panelClass: 'success',
    duration: 20000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  };

  private snackbarSubject = new Subject<any>();
  public snackbarState = this.snackbarSubject.asObservable();

  constructor(public snackBar: MatSnackBar, private zone: NgZone) { }

  public showSuccess(message: string): void {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data: {
        text: message,
        type: 'success',
        statusName: "Success"
      },
      panelClass: ['success'], horizontalPosition: 'right',
      verticalPosition: 'top', duration: 5000
    });
  }

  public showError(message: string): void {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data: {
        text: message,
        type: 'error',
        statusName: "Failure"
      },
      panelClass: ['error'], horizontalPosition: 'right',
      verticalPosition: 'top', duration: 5000
    });

  }

  public showWarning(message: string): void {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data: {
        text: message,
        type: 'warning',
        statusName: "Alert"
      },
      panelClass: ['warning'], horizontalPosition: 'right',
      verticalPosition: 'top', duration: 5000
    });

  }

  public showInfo(message: string): void {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data: {
        text: message,
        type: 'info',
        statusName: "Info"
      },
      panelClass: ['info'], horizontalPosition: 'right',
      verticalPosition: 'top', duration: 5000
    });

  }

}
