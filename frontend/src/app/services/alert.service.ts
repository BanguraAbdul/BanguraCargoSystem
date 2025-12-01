import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  success(message: string, title: string = 'Success!') {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      confirmButtonColor: '#00a896',
      confirmButtonText: 'OK'
      // Removed timer - alert stays until user clicks OK
    });
  }

  error(message: string, title: string = 'Error!') {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonColor: '#c1121f',
      confirmButtonText: 'OK'
    });
  }

  warning(message: string, title: string = 'Warning!') {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
      confirmButtonColor: '#f4a261',
      confirmButtonText: 'OK'
    });
  }

  info(message: string, title: string = 'Info') {
    return Swal.fire({
      icon: 'info',
      title: title,
      text: message,
      confirmButtonColor: '#4a90e2',
      confirmButtonText: 'OK'
    });
  }

  confirm(message: string, title: string = 'Are you sure?') {
    return Swal.fire({
      icon: 'question',
      title: title,
      text: message,
      showCancelButton: true,
      confirmButtonColor: '#00a896',
      cancelButtonColor: '#c1121f',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    });
  }

  loading(message: string = 'Please wait...') {
    Swal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  close() {
    Swal.close();
  }
}
