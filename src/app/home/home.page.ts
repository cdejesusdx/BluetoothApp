import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
 
@Component({
 selector: 'app-home',
 templateUrl: 'home.page.html',
 styleUrls: ['home.page.scss'],
})
export class HomePage {
 
 unpairedDevices: any;
 pairedDevices: any;
 gettingDevices: boolean;
 
 constructor(private bluetoothSerial: BluetoothSerial, private alertController: AlertController) {
   bluetoothSerial.enable();
 }
 
 // Identificar la conectividad 
 deviceConnected() {
  this.bluetoothSerial.isConnected().then(success => {
    alert('Conectado exitosamente');
  }, error => {
    alert('error' + JSON.stringify(error));
  });
}

 // Buscar Bluetooth Disponibles
 searchBluetooth() {
   this.pairedDevices = null;
   this.unpairedDevices = null;
   this.gettingDevices = true;
   const unPair = [];

   this.bluetoothSerial.discoverUnpaired().then((success) => {
     success.forEach((value, key) => {
       var exists = false;
       unPair.forEach((val2, i) => {
         if (value.id === val2.id) {
           exists = true;
         }
       });
       if (exists === false && value.id !== '') {
         unPair.push(value);
       }
     });
     this.unpairedDevices = unPair;
     this.gettingDevices = false;
   },
     (err) => {console.log(err);});
 
   this.bluetoothSerial.list().then((success) => {
     this.pairedDevices = success;
   },
     (err) => {});
   }
 
 success = (data) => {
   this.deviceConnected();
 }
 fail = (error) => {
   alert(error);
 }
 
 // Conectar a un dispositivo
 async selectDevice(id: any) {
   const alert = await this.alertController.create({
     header: 'Conectar',
     message: 'Seguro que desea conectarse a este dispositivo?',
     buttons: [
       {
         text: 'Cancelar',
         role: 'cancelar',
         handler: () => {
           console.log('Cancelar click');
         }
       },
       {
         text: 'Conectar',
         handler: () => {
           this.bluetoothSerial.connect(id).subscribe(this.success, this.fail);
         }
       }
     ]
   });
   await alert.present();
 }
 
 //Desconectar a un dispositivo
 async disconnect() {
   const alert = await this.alertController.create({
     header: 'Desconectar',
     message: 'Seguro que desea desconectarse?',
     buttons: [
       {
         text: 'Cancelar',
         role: 'cancelar',
         handler: () => {
          console.log('Cancelar click');
         }
       },
       {
         text: 'Desconectar',
         handler: () => {
           this.bluetoothSerial.disconnect();
         }
       }
     ]
   });
   await alert.present();
 }
}