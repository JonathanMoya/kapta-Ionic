import {Component, ElementRef, ViewChild} from '@angular/core';
import {CameraOptions, CameraResultType, CameraSource, Plugins} from "@capacitor/core";
import {DropboxSService} from "../../services/dropbox-s.service";
import * as watermark from 'watermarkjs';
import {DomSanitizer} from "@angular/platform-browser";
import {AlertController} from "@ionic/angular";

const {Camera} = Plugins;

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

    @ViewChild('previewImage') waterMarkImage: ElementRef;

    actualPokemon = {
        name: '',
        img: ''
    };

    async takePicture() {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: true,
            resultType: CameraResultType.Uri
        });
        // image.webPath will contain a path that can be set as an image src.
        // You can access the original file using image.path, which can be
        // passed to the Filesystem API to read the raw data of the image,
        // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
        var imageUrl = image.webPath;
        console.log(image);
        // Can be set to the src of an image now
        console.log(imageUrl);
        this.getBase64ImageFromUrl(imageUrl).then(result => {
            console.log(result);
        });

        const options = {
            init(img) {
                img.crossOrigin = 'anonymous'
            }
        };
        this.getBase64ImageFromUrl(this.actualPokemon.img)
            .then(result => {
                console.log(result);
                console.log(this.resizeImage(result));
                this.getBase64ImageFromUrl(imageUrl).then(upload => {
                    watermark([upload], options)
                        .image(watermark.text.lowerRight(this.actualPokemon.name, '48px Josefin Slab', '#fff', 0.5))
                        .then(img => {
                                watermark([img, this.resizeImage(result)], options)
                                    .image(watermark.image.lowerLeft())
                                    .then(img2 => {
                                        this.sanitizer.bypassSecurityTrustResourceUrl(img2.src);
                                        document.getElementById('container').appendChild(img2)
                                        this.newImage = img2.src;
                                    });
                            }
                        );
                })
            })
            .catch(err => console.error(err));
    }

    constructor(private service: DropboxSService, private sanitizer: DomSanitizer, public alertController: AlertController) {
        // this.takePhoto();
        this.service.getPokemonInfo().subscribe(res => {
            console.log(res);
            this.actualPokemon.name = res.name;
            this.actualPokemon.img = res.sprites.front_default;
            document.getElementById('cargandoId').style.display = 'none';
        })
    }

    imgURL: any = '';
    blobImage: any = '';
    originalImage: any = '';
    newImage: any = '';

    async getBase64ImageFromUrl(imageUrl) {
        var res = await fetch(imageUrl);
        var blob = await res.blob();

        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.addEventListener("load", function () {
                resolve(reader.result);
            }, false);

            reader.onerror = () => {
                return reject(this);
            };
            reader.readAsDataURL(blob);
        })
    }

    resizeImage(base64Str) {

        var img = new Image();
        img.src = base64Str;
        var canvas = document.createElement('canvas');
        var MAX_WIDTH = 400;
        var MAX_HEIGHT = 350;
        var width = img.width;
        var height = img.height;

        if (width > height) {
            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }
        } else {
            if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
            }
        }
        canvas.width = 500;
        canvas.height = 500;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 500, 500);
        return canvas.toDataURL();
    }

    renderPhoto() {
        // @ts-ignore


    }

    sendFile() {
        if(this.newImage!==''){
            document.getElementById('cargandoId').style.display = 'block';
            console.log('entra1');
            this.service.uploadFile(this.newImage).subscribe(res => {
                console.log(res);
                document.getElementById('cargandoId').style.display = 'none';
            }, err => {
                console.log(err);
                console.log(err.status);
                if (err.status === 200) {
                    this.presentAlert();
                    document.getElementById('cargandoId').style.display = 'none';
                } else {
                    this.presentAlertError();
                    document.getElementById('cargandoId').style.display = 'none';
                }
            });
        }else{
            this.presentAlertError2();
        }
    }

    async presentAlert() {
        const alert = await this.alertController.create({
            header: 'Alerta',
            subHeader: 'Mensaje enviado correctamente',
            // message: 'This is an alert message.',
            buttons: ['OK']
        });

        await alert.present();
    }

    async presentAlertError() {
        const alert = await this.alertController.create({
            header: 'Alerta',
            subHeader: 'Error enviando la imagen',
            // message: 'This is an alert message.',
            buttons: ['OK']
        });

        await alert.present();
    }
    async presentAlertError2() {
        const alert = await this.alertController.create({
            header: 'Alerta',
            subHeader: 'Selecciona o toma una foto',
            // message: 'This is an alert message.',
            buttons: ['OK']
        });

        await alert.present();
    }
}
