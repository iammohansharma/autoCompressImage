import { Component, ViewChild } from '@angular/core';
import {Camera, CameraResultType, CameraSource, ImageOptions} from '@capacitor/camera'
import {DataUrl, NgxImageCompressService} from "ngx-image-compress";
import {AlertController, IonSlides} from'@ionic/angular'
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('slides') slides: IonSlides;
  cameraImage: any ;
  camerImage: 1;
  kbytes:number;
  kbyte: number;
  compressImage:any;
  imagebytes:number;

  slideoption: any = {};
  slideimages: any[] = [];

  constructor(private imageCompress:NgxImageCompressService , private alert:AlertController) {}


ngOnInit(){
     
  this.slideimages = [
    'assets/images/1.jpg',
    'assets/images/2.png',
    'assets/images/3.JPG'
  ];
    // Slider animation 
  this.slideoption = {
    on: {
      beforeInit() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}fade`);
        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: true,
        };
        swiper.params = Object.assign(swiper.params, overwriteParams);
        swiper.params = Object.assign(swiper.originalParams, overwriteParams);
      },
      setTranslate() {
        const swiper = this;
        const { slides } = swiper;
        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = swiper.slides.eq(i);
          const offset$$1 = $slideEl[0].swiperSlideOffset;
          let tx = -offset$$1;
          if (!swiper.params.virtualTranslate) tx -= swiper.translate;
          let ty = 0;
          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
          }
          const slideOpacity = swiper.params.fadeEffect.crossFade
            ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
            : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
          $slideEl
            .css({
              opacity: slideOpacity,
            })
            .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
        }
      },
      setTransition(duration) {
        const swiper = this;
        const { slides, $wrapperEl } = swiper;
        slides.transition(duration);
        if (swiper.params.virtualTranslate && duration !== 0) {
          let eventTriggered = false;
          slides.transitionEnd(() => {
            if (eventTriggered) return;
            if (!swiper || swiper.destroyed) return;
            eventTriggered = true;
            swiper.animating = false;
            const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
            for (let i = 0; i < triggerEvents.length; i += 1) {
              $wrapperEl.trigger(triggerEvents[i]);
            }
          });
        }
      },
    }
  }


  Camera.requestPermissions({permissions:['photos']})
}
  //  Slider AutoPlay
ionViewDidEnter(){
  this.slides.startAutoplay();
}


// Taking Picute from camera
  async takePicture(){
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.DataUrl,
  });

 this.imagebytes = 0;
  // Here you get the image as result.
  const theActualPicture = image.dataUrl;
  this.cameraImage = theActualPicture;
this.kbyte= this.calculateImageSize(this.cameraImage);

// compress the image if its size more than 1 MB
 
if(this.kbyte>1024){

 this.alert.create({
   header: 'Over 1MB',
   subHeader: 'Your Selected Image Size is more than 1024KB',
   message: 'Now the compressed image will be display',
   buttons: ['Alright']
 }).then(res=>{
   res.present();
 })



   this.imageCompress.compressFile(theActualPicture,50,50).then((result:DataUrl)=>{
     this.compressImage = result;
     this.cameraImage = this.compressImage;
     var a = this.imageCompress.byteCount(this.compressImage)
      this.imagebytes = a/1000
      console.log('in bytes'+ this.imagebytes)
    })
}
}
 
// getting the value in bytes

calculateImageSize(base64String) {
  let padding;
  let inBytes;
  let base64StringLength;
  if (base64String.endsWith('==')) { padding = 2; }
  else if (base64String.endsWith('=')) { padding = 1; }
  else { padding = 0; }

  base64StringLength = base64String.length;
  console.log(base64StringLength);
  inBytes = (base64StringLength / 4) * 3 - padding;
  console.log(inBytes);
  this.kbytes = inBytes / 1000;
  console.log("the image size before:" + this.kbytes)
  
  return this.kbytes;
}


}
