(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e,t,n,r,i,a,o,s,c,l=1e3,u=1001,d=1002,f=1003,p=1004,m=1005,h=1006,g=1007,_=1008,v=1009,y=1010,b=1011,x=1012,S=1013,C=1014,w=1015,T=1016,E=1017,D=1018,ee=1020,O=35902,k=35899,A=1021,te=1022,j=1023,ne=1026,M=1027,re=1028,ie=1029,ae=1030,oe=1031,se=1033,ce=33776,le=33777,ue=33778,N=33779,de=35840,fe=35841,pe=35842,me=35843,he=36196,ge=37492,_e=37496,ve=37488,ye=37489,be=37490,xe=37491,Se=37808,Ce=37809,we=37810,Te=37811,Ee=37812,De=37813,Oe=37814,ke=37815,Ae=37816,je=37817,Me=37818,Ne=37819,Pe=37820,P=37821,Fe=36492,Ie=36494,Le=36495,F=36283,Re=36284,I=36285,ze=36286,Be=2300,Ve=2301,He=2302,Ue=2303,We=2400,Ge=2401,Ke=2402,qe=3200,Je=`srgb`,Ye=`srgb-linear`,Xe=`linear`,Ze=`srgb`,Qe=7680,$e=35044,et=2e3;function tt(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function nt(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function rt(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function it(){let e=rt(`canvas`);return e.style.display=`block`,e}var at={};function ot(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function st(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function L(...e){e=st(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function R(...e){e=st(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function ct(...e){let t=e.join(` `);t in at||(at[t]=!0,L(...e))}function lt(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var ut={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},dt=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},ft=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),pt=Math.PI/180,mt=180/Math.PI;function ht(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(ft[e&255]+ft[e>>8&255]+ft[e>>16&255]+ft[e>>24&255]+`-`+ft[t&255]+ft[t>>8&255]+`-`+ft[t>>16&15|64]+ft[t>>24&255]+`-`+ft[n&63|128]+ft[n>>8&255]+`-`+ft[n>>16&255]+ft[n>>24&255]+ft[r&255]+ft[r>>8&255]+ft[r>>16&255]+ft[r>>24&255]).toLowerCase()}function z(e,t,n){return Math.max(t,Math.min(n,e))}function gt(e,t){return(e%t+t)%t}function _t(e,t,n){return(1-n)*e+n*t}function vt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function yt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}o=Symbol.iterator;var B=class{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=z(this.x,e.x,t.x),this.y=z(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=z(this.x,e,t),this.y=z(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(z(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(z(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[o](){yield this.x,yield this.y}};e=B,e.prototype.isVector2=!0;var bt=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:L(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(z(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}};s=Symbol.iterator;var V=class{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(St.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(St.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=z(this.x,e.x,t.x),this.y=z(this.y,e.y,t.y),this.z=z(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=z(this.x,e,t),this.y=z(this.y,e,t),this.z=z(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(z(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return xt.copy(this).projectOnVector(e),this.sub(xt)}reflect(e){return this.sub(xt.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(z(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[s](){yield this.x,yield this.y,yield this.z}};t=V,t.prototype.isVector3=!0;var xt=new V,St=new bt,H=class{constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return ct(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(Ct.makeScale(e,t)),this}rotate(e){return ct(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(Ct.makeRotation(-e)),this}translate(e,t){return ct(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(Ct.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};n=H,n.prototype.isMatrix3=!0;var Ct=new H,wt=new H().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Tt=new H().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Et(){let e={enabled:!0,workingColorSpace:Ye,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=Ot(e.r),e.g=Ot(e.g),e.b=Ot(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=kt(e.r),e.g=kt(e.g),e.b=kt(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?Xe:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return ct(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return ct(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[Ye]:{primaries:t,whitePoint:r,transfer:Xe,toXYZ:wt,fromXYZ:Tt,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Je},outputColorSpaceConfig:{drawingBufferColorSpace:Je}},[Je]:{primaries:t,whitePoint:r,transfer:Ze,toXYZ:wt,fromXYZ:Tt,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Je}}}),e}var Dt=Et();function Ot(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function kt(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var At,jt=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{At===void 0&&(At=rt(`canvas`)),At.width=e.width,At.height=e.height;let t=At.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=At}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=rt(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Ot(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Ot(t[e]/255)*255):t[e]=Ot(t[e]);return{data:t,width:e.width,height:e.height}}return L(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Mt=0,Nt=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Mt++}),this.uuid=ht(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Pt(r[t].image)):e.push(Pt(r[t]))}else e=Pt(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Pt(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?jt.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(L(`Texture: Unable to serialize Texture.`),{})}var Ft=0,It=new V,Lt=class e extends dt{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=u,i=u,a=h,o=_,s=j,c=v,l=e.DEFAULT_ANISOTROPY,d=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ft++}),this.uuid=ht(),this.name=``,this.source=new Nt(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new B(0,0),this.repeat=new B(1,1),this.center=new B(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new H,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(It).x}get height(){return this.source.getSize(It).y}get depth(){return this.source.getSize(It).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){L(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?L(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case l:e.x-=Math.floor(e.x);break;case u:e.x=e.x<0?0:1;break;case d:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case l:e.y-=Math.floor(e.y);break;case u:e.y=e.y<0?0:1;break;case d:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Lt.DEFAULT_IMAGE=null,Lt.DEFAULT_MAPPING=300,Lt.DEFAULT_ANISOTROPY=1,c=Symbol.iterator;var Rt=class{constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=z(this.x,e.x,t.x),this.y=z(this.y,e.y,t.y),this.z=z(this.z,e.z,t.z),this.w=z(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=z(this.x,e,t),this.y=z(this.y,e,t),this.z=z(this.z,e,t),this.w=z(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(z(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[c](){yield this.x,yield this.y,yield this.z,yield this.w}};r=Rt,r.prototype.isVector4=!0;var zt=class extends dt{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:h,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Rt(0,0,e,t),this.scissorTest=!1,this.viewport=new Rt(0,0,e,t),this.textures=[];let r=new Lt({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:h,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new Nt(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},Bt=class extends zt{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Vt=class extends Lt{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=f,this.minFilter=f,this.wrapR=u,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Ht=class extends Lt{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=f,this.minFilter=f,this.wrapR=u,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},Ut=class e{constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/Wt.setFromMatrixColumn(e,0).length(),i=1/Wt.setFromMatrixColumn(e,1).length(),a=1/Wt.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Kt,e,qt)}lookAt(e,t,n){let r=this.elements;return Xt.subVectors(e,t),Xt.lengthSq()===0&&(Xt.z=1),Xt.normalize(),Jt.crossVectors(n,Xt),Jt.lengthSq()===0&&(Math.abs(n.z)===1?Xt.x+=1e-4:Xt.z+=1e-4,Xt.normalize(),Jt.crossVectors(n,Xt)),Jt.normalize(),Yt.crossVectors(Xt,Jt),r[0]=Jt.x,r[4]=Yt.x,r[8]=Xt.x,r[1]=Jt.y,r[5]=Yt.y,r[9]=Xt.y,r[2]=Jt.z,r[6]=Yt.z,r[10]=Xt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],ee=r[13],O=r[2],k=r[6],A=r[10],te=r[14],j=r[3],ne=r[7],M=r[11],re=r[15];return i[0]=a*x+o*T+s*O+c*j,i[4]=a*S+o*E+s*k+c*ne,i[8]=a*C+o*D+s*A+c*M,i[12]=a*w+o*ee+s*te+c*re,i[1]=l*x+u*T+d*O+f*j,i[5]=l*S+u*E+d*k+f*ne,i[9]=l*C+u*D+d*A+f*M,i[13]=l*w+u*ee+d*te+f*re,i[2]=p*x+m*T+h*O+g*j,i[6]=p*S+m*E+h*k+g*ne,i[10]=p*C+m*D+h*A+g*M,i[14]=p*w+m*ee+h*te+g*re,i[3]=_*x+v*T+y*O+b*j,i[7]=_*S+v*E+y*k+b*ne,i[11]=_*C+v*D+y*A+b*M,i[15]=_*w+v*ee+y*te+b*re,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,ee=d*g-f*h,O=_*ee-v*D+y*E+b*T-x*w+S*C;if(O===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let k=1/O;return e[0]=(o*ee-s*D+c*E)*k,e[1]=(r*D-n*ee-i*E)*k,e[2]=(m*S-h*x+g*b)*k,e[3]=(d*x-u*S-f*b)*k,e[4]=(s*T-a*ee-c*w)*k,e[5]=(t*ee-r*T+i*w)*k,e[6]=(h*y-p*S-g*v)*k,e[7]=(l*S-d*y+f*v)*k,e[8]=(a*D-o*T+c*C)*k,e[9]=(n*T-t*D-i*C)*k,e[10]=(p*x-m*y+g*_)*k,e[11]=(u*y-l*x-f*_)*k,e[12]=(o*w-a*E-s*C)*k,e[13]=(t*E-n*w+r*C)*k,e[14]=(m*v-p*b-h*_)*k,e[15]=(l*b-u*v+d*_)*k,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=Wt.set(r[0],r[1],r[2]).length(),o=Wt.set(r[4],r[5],r[6]).length(),s=Wt.set(r[8],r[9],r[10]).length();i<0&&(a=-a),Gt.copy(this);let c=1/a,l=1/o,u=1/s;return Gt.elements[0]*=c,Gt.elements[1]*=c,Gt.elements[2]*=c,Gt.elements[4]*=l,Gt.elements[5]*=l,Gt.elements[6]*=l,Gt.elements[8]*=u,Gt.elements[9]*=u,Gt.elements[10]*=u,t.setFromRotationMatrix(Gt),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=et,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=et,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};i=Ut,i.prototype.isMatrix4=!0;var Wt=new V,Gt=new Ut,Kt=new V(0,0,0),qt=new V(1,1,1),Jt=new V,Yt=new V,Xt=new V,Zt=new Ut,Qt=new bt,$t=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(z(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-z(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(z(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-z(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(z(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-z(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:L(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Zt.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Zt,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Qt.setFromEuler(this),this.setFromQuaternion(Qt,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};$t.DEFAULT_ORDER=`XYZ`;var en=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},tn=0,nn=new V,rn=new bt,an=new Ut,on=new V,sn=new V,cn=new V,ln=new bt,un=new V(1,0,0),dn=new V(0,1,0),fn=new V(0,0,1),pn={type:`added`},mn={type:`removed`},hn={type:`childadded`,child:null},gn={type:`childremoved`,child:null},_n=class e extends dt{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:tn++}),this.uuid=ht(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new V,n=new $t,r=new bt,i=new V(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Ut},normalMatrix:{value:new H}}),this.matrix=new Ut,this.matrixWorld=new Ut,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new en,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return rn.setFromAxisAngle(e,t),this.quaternion.multiply(rn),this}rotateOnWorldAxis(e,t){return rn.setFromAxisAngle(e,t),this.quaternion.premultiply(rn),this}rotateX(e){return this.rotateOnAxis(un,e)}rotateY(e){return this.rotateOnAxis(dn,e)}rotateZ(e){return this.rotateOnAxis(fn,e)}translateOnAxis(e,t){return nn.copy(e).applyQuaternion(this.quaternion),this.position.add(nn.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(un,e)}translateY(e){return this.translateOnAxis(dn,e)}translateZ(e){return this.translateOnAxis(fn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(an.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?on.copy(e):on.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),sn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?an.lookAt(sn,on,this.up):an.lookAt(on,sn,this.up),this.quaternion.setFromRotationMatrix(an),r&&(an.extractRotation(r.matrixWorld),rn.setFromRotationMatrix(an),this.quaternion.premultiply(rn.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(R(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(pn),hn.child=e,this.dispatchEvent(hn),hn.child=null):R(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(mn),gn.child=e,this.dispatchEvent(gn),gn.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),an.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),an.multiply(e.parent.matrixWorld)),e.applyMatrix4(an),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(pn),hn.child=e,this.dispatchEvent(hn),hn.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(sn,e,cn),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(sn,ln,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};_n.DEFAULT_UP=new V(0,1,0),_n.DEFAULT_MATRIX_AUTO_UPDATE=!0,_n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var vn=class extends _n{constructor(){super(),this.isGroup=!0,this.type=`Group`}},yn={type:`move`},bn=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new vn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new vn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new vn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(yn)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new vn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},xn={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Sn={h:0,s:0,l:0},Cn={h:0,s:0,l:0};function wn(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var U=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Je){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Dt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Dt.workingColorSpace){return this.r=e,this.g=t,this.b=n,Dt.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Dt.workingColorSpace){if(e=gt(e,1),t=z(t,0,1),n=z(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=wn(i,r,e+1/3),this.g=wn(i,r,e),this.b=wn(i,r,e-1/3)}return Dt.colorSpaceToWorking(this,r),this}setStyle(e,t=Je){function n(t){t!==void 0&&parseFloat(t)<1&&L(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:L(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);L(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Je){let n=xn[e.toLowerCase()];return n===void 0?L(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ot(e.r),this.g=Ot(e.g),this.b=Ot(e.b),this}copyLinearToSRGB(e){return this.r=kt(e.r),this.g=kt(e.g),this.b=kt(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Je){return Dt.workingToColorSpace(Tn.copy(this),e),Math.round(z(Tn.r*255,0,255))*65536+Math.round(z(Tn.g*255,0,255))*256+Math.round(z(Tn.b*255,0,255))}getHexString(e=Je){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Dt.workingColorSpace){Dt.workingToColorSpace(Tn.copy(this),t);let n=Tn.r,r=Tn.g,i=Tn.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=Dt.workingColorSpace){return Dt.workingToColorSpace(Tn.copy(this),t),e.r=Tn.r,e.g=Tn.g,e.b=Tn.b,e}getStyle(e=Je){Dt.workingToColorSpace(Tn.copy(this),e);let t=Tn.r,n=Tn.g,r=Tn.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(Sn),this.setHSL(Sn.h+e,Sn.s+t,Sn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Sn),e.getHSL(Cn);let n=_t(Sn.h,Cn.h,t),r=_t(Sn.s,Cn.s,t),i=_t(Sn.l,Cn.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Tn=new U;U.NAMES=xn;var En=class e{constructor(e,t=25e-5){this.isFogExp2=!0,this.name=``,this.color=new U(e),this.density=t}clone(){return new e(this.color,this.density)}toJSON(){return{type:`FogExp2`,name:this.name,color:this.color.getHex(),density:this.density}}},Dn=class extends _n{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new $t,this.environmentIntensity=1,this.environmentRotation=new $t,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},On=new V,kn=new V,An=new V,jn=new V,Mn=new V,Nn=new V,Pn=new V,Fn=new V,In=new V,Ln=new V,Rn=new Rt,zn=new Rt,Bn=new Rt,Vn=class e{constructor(e=new V,t=new V,n=new V){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),On.subVectors(e,t),r.cross(On);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){On.subVectors(r,t),kn.subVectors(n,t),An.subVectors(e,t);let a=On.dot(On),o=On.dot(kn),s=On.dot(An),c=kn.dot(kn),l=kn.dot(An),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,jn)!==null&&jn.x>=0&&jn.y>=0&&jn.x+jn.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,jn)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,jn.x),s.addScaledVector(a,jn.y),s.addScaledVector(o,jn.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return Rn.setScalar(0),zn.setScalar(0),Bn.setScalar(0),Rn.fromBufferAttribute(e,t),zn.fromBufferAttribute(e,n),Bn.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Rn,i.x),a.addScaledVector(zn,i.y),a.addScaledVector(Bn,i.z),a}static isFrontFacing(e,t,n,r){return On.subVectors(n,t),kn.subVectors(e,t),On.cross(kn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return On.subVectors(this.c,this.b),kn.subVectors(this.a,this.b),On.cross(kn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Mn.subVectors(r,n),Nn.subVectors(i,n),Fn.subVectors(e,n);let s=Mn.dot(Fn),c=Nn.dot(Fn);if(s<=0&&c<=0)return t.copy(n);In.subVectors(e,r);let l=Mn.dot(In),u=Nn.dot(In);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(Mn,a);Ln.subVectors(e,i);let f=Mn.dot(Ln),p=Nn.dot(Ln);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Nn,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return Pn.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(Pn,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Mn,a).addScaledVector(Nn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Hn=class{constructor(e=new V(1/0,1/0,1/0),t=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Wn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Wn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Wn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,Wn):Wn.fromBufferAttribute(r,t),Wn.applyMatrix4(e.matrixWorld),this.expandByPoint(Wn);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),Gn.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),Gn.copy(e.boundingBox)),Gn.applyMatrix4(e.matrixWorld),this.union(Gn)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Wn),Wn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Qn),$n.subVectors(this.max,Qn),Kn.subVectors(e.a,Qn),qn.subVectors(e.b,Qn),Jn.subVectors(e.c,Qn),Yn.subVectors(qn,Kn),Xn.subVectors(Jn,qn),Zn.subVectors(Kn,Jn);let t=[0,-Yn.z,Yn.y,0,-Xn.z,Xn.y,0,-Zn.z,Zn.y,Yn.z,0,-Yn.x,Xn.z,0,-Xn.x,Zn.z,0,-Zn.x,-Yn.y,Yn.x,0,-Xn.y,Xn.x,0,-Zn.y,Zn.x,0];return!nr(t,Kn,qn,Jn,$n)||(t=[1,0,0,0,1,0,0,0,1],!nr(t,Kn,qn,Jn,$n))?!1:(er.crossVectors(Yn,Xn),t=[er.x,er.y,er.z],nr(t,Kn,qn,Jn,$n))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Wn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Wn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(Un[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Un[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Un[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Un[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Un[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Un[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Un[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Un[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Un)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Un=[new V,new V,new V,new V,new V,new V,new V,new V],Wn=new V,Gn=new Hn,Kn=new V,qn=new V,Jn=new V,Yn=new V,Xn=new V,Zn=new V,Qn=new V,$n=new V,er=new V,tr=new V;function nr(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){tr.fromArray(e,a);let o=i.x*Math.abs(tr.x)+i.y*Math.abs(tr.y)+i.z*Math.abs(tr.z),s=t.dot(tr),c=n.dot(tr),l=r.dot(tr);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var rr=new V,ir=new B,ar=0,or=class extends dt{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ar++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=$e,this.updateRanges=[],this.gpuType=w,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ir.fromBufferAttribute(this,t),ir.applyMatrix3(e),this.setXY(t,ir.x,ir.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)rr.fromBufferAttribute(this,t),rr.applyMatrix3(e),this.setXYZ(t,rr.x,rr.y,rr.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)rr.fromBufferAttribute(this,t),rr.applyMatrix4(e),this.setXYZ(t,rr.x,rr.y,rr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)rr.fromBufferAttribute(this,t),rr.applyNormalMatrix(e),this.setXYZ(t,rr.x,rr.y,rr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)rr.fromBufferAttribute(this,t),rr.transformDirection(e),this.setXYZ(t,rr.x,rr.y,rr.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=vt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=yt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=vt(t,this.array)),t}setX(e,t){return this.normalized&&(t=yt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=vt(t,this.array)),t}setY(e,t){return this.normalized&&(t=yt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=vt(t,this.array)),t}setZ(e,t){return this.normalized&&(t=yt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=vt(t,this.array)),t}setW(e,t){return this.normalized&&(t=yt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array),r=yt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array),r=yt(r,this.array),i=yt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},sr=class extends or{constructor(e,t,n){super(new Uint16Array(e),t,n)}},cr=class extends or{constructor(e,t,n){super(new Uint32Array(e),t,n)}},W=class extends or{constructor(e,t,n){super(new Float32Array(e),t,n)}},lr=new Hn,ur=new V,dr=new V,fr=class{constructor(e=new V,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?lr.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ur.subVectors(e,this.center);let t=ur.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(ur,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(dr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ur.copy(e.center).add(dr)),this.expandByPoint(ur.copy(e.center).sub(dr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},pr=0,mr=new Ut,hr=new _n,gr=new V,_r=new Hn,vr=new Hn,yr=new V,br=class e extends dt{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:pr++}),this.uuid=ht(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(tt(e)?cr:sr)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new H().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return mr.makeRotationFromQuaternion(e),this.applyMatrix4(mr),this}rotateX(e){return mr.makeRotationX(e),this.applyMatrix4(mr),this}rotateY(e){return mr.makeRotationY(e),this.applyMatrix4(mr),this}rotateZ(e){return mr.makeRotationZ(e),this.applyMatrix4(mr),this}translate(e,t,n){return mr.makeTranslation(e,t,n),this.applyMatrix4(mr),this}scale(e,t,n){return mr.makeScale(e,t,n),this.applyMatrix4(mr),this}lookAt(e){return hr.lookAt(e),hr.updateMatrix(),this.applyMatrix4(hr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(gr).negate(),this.translate(gr.x,gr.y,gr.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new W(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&L(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Hn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)R(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];_r.setFromBufferAttribute(n),this.morphTargetsRelative?(yr.addVectors(this.boundingBox.min,_r.min),this.boundingBox.expandByPoint(yr),yr.addVectors(this.boundingBox.max,_r.max),this.boundingBox.expandByPoint(yr)):(this.boundingBox.expandByPoint(_r.min),this.boundingBox.expandByPoint(_r.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&R(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new fr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)R(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new V,1/0);else if(e){let n=this.boundingSphere.center;if(_r.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];vr.setFromBufferAttribute(n),this.morphTargetsRelative?(yr.addVectors(_r.min,vr.min),_r.expandByPoint(yr),yr.addVectors(_r.max,vr.max),_r.expandByPoint(yr)):(_r.expandByPoint(vr.min),_r.expandByPoint(vr.max))}_r.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)yr.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(yr));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)yr.fromBufferAttribute(a,t),o&&(gr.fromBufferAttribute(e,t),yr.add(gr)),r=Math.max(r,n.distanceToSquared(yr))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&R(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){R(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new or(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new V,s[e]=new V;let c=new V,l=new V,u=new V,d=new B,f=new B,p=new B,m=new V,h=new V;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new V,y=new V,b=new V,x=new V;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new or(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new V,i=new V,a=new V,o=new V,s=new V,c=new V,l=new V,u=new V;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)yr.fromBufferAttribute(e,t),yr.normalize(),e.setXYZ(t,yr.x,yr.y,yr.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new or(a,r,i)}if(this.index===null)return L(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},xr=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e===void 0?0:e.length/t,this.usage=$e,this.updateRanges=[],this.version=0,this.uuid=ht()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,i=this.stride;r<i;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ht()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ht()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},Sr=new V,Cr=class e{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name=``,this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Sr.fromBufferAttribute(this,t),Sr.applyMatrix4(e),this.setXYZ(t,Sr.x,Sr.y,Sr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Sr.fromBufferAttribute(this,t),Sr.applyNormalMatrix(e),this.setXYZ(t,Sr.x,Sr.y,Sr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Sr.fromBufferAttribute(this,t),Sr.transformDirection(e),this.setXYZ(t,Sr.x,Sr.y,Sr.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=vt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=yt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=yt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=yt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=yt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=yt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=vt(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=vt(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=vt(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=vt(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array),r=yt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array),r=yt(r,this.array),i=yt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=i,this}clone(t){if(t===void 0){ot(`InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return new or(new this.array.constructor(e),this.itemSize,this.normalized)}return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new e(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){ot(`InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},wr=new V,Tr=new V,Er=new H,Dr=class{constructor(e=new V(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=wr.subVectors(n,t).cross(Tr.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(wr),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Er.getNormalMatrix(e),r=this.coplanarPoint(wr).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Or=0,kr=class extends dt{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Or++}),this.uuid=ht(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new U(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Qe,this.stencilZFail=Qe,this.stencilZPass=Qe,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){L(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?L(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new U().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new Dr().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new B().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new B().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},Ar=class extends kr{constructor(e){super(),this.isSpriteMaterial=!0,this.type=`SpriteMaterial`,this.color=new U(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},jr,Mr=new V,Nr=new V,Pr=new V,Fr=new B,Ir=new B,Lr=new Ut,Rr=new V,zr=new V,Br=new V,Vr=new B,Hr=new B,Ur=new B,Wr=class extends _n{constructor(e=new Ar){if(super(),this.isSprite=!0,this.type=`Sprite`,jr===void 0){jr=new br;let e=new xr(new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),5);jr.setIndex([0,1,2,0,2,3]),jr.setAttribute(`position`,new Cr(e,3,0,!1)),jr.setAttribute(`uv`,new Cr(e,2,3,!1))}this.geometry=jr,this.material=e,this.center=new B(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&R(`Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.`),Nr.setFromMatrixScale(this.matrixWorld),Lr.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Pr.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Nr.multiplyScalar(-Pr.z);let n=this.material.rotation,r,i;n!==0&&(i=Math.cos(n),r=Math.sin(n));let a=this.center;Gr(Rr.set(-.5,-.5,0),Pr,a,Nr,r,i),Gr(zr.set(.5,-.5,0),Pr,a,Nr,r,i),Gr(Br.set(.5,.5,0),Pr,a,Nr,r,i),Vr.set(0,0),Hr.set(1,0),Ur.set(1,1);let o=e.ray.intersectTriangle(Rr,zr,Br,!1,Mr);if(o===null&&(Gr(zr.set(-.5,.5,0),Pr,a,Nr,r,i),Hr.set(0,1),o=e.ray.intersectTriangle(Rr,Br,zr,!1,Mr),o===null))return;let s=e.ray.origin.distanceTo(Mr);s<e.near||s>e.far||t.push({distance:s,point:Mr.clone(),uv:Vn.getInterpolation(Mr,Rr,zr,Br,Vr,Hr,Ur,new B),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function Gr(e,t,n,r,i,a){Fr.subVectors(e,n).addScalar(.5).multiply(r),i===void 0?Ir.copy(Fr):(Ir.x=a*Fr.x-i*Fr.y,Ir.y=i*Fr.x+a*Fr.y),e.copy(t),e.x+=Ir.x,e.y+=Ir.y,e.applyMatrix4(Lr)}var Kr=new V,qr=new V,Jr=new V,Yr=new V,Xr=class{constructor(e=new V,t=new V(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Kr)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Kr.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Kr.copy(this.origin).addScaledVector(this.direction,t),Kr.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){qr.copy(e).add(t).multiplyScalar(.5),Jr.copy(t).sub(e).normalize(),Yr.copy(this.origin).sub(qr);let i=e.distanceTo(t)*.5,a=-this.direction.dot(Jr),o=Yr.dot(this.direction),s=-Yr.dot(Jr),c=Yr.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(qr).addScaledVector(Jr,d),f}intersectSphere(e,t){if(e.radius<0)return null;Kr.subVectors(e.center,this.origin);let n=Kr.dot(this.direction),r=Kr.dot(Kr)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Kr)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,ee,O,k,A,te,j;if(y>=b&&y>=x?(w=s,D=u,k=p,j=g,s>=0?(S=c,C=l,T=d,E=f,ee=m,O=h,A=_,te=v):(S=l,C=c,T=f,E=d,ee=h,O=m,A=v,te=_)):b>=x?(w=c,D=d,k=m,j=_,c>=0?(S=l,C=s,T=f,E=u,ee=h,O=p,A=v,te=g):(S=s,C=l,T=u,E=f,ee=p,O=h,A=g,te=v)):(w=l,D=f,k=h,j=v,l>=0?(S=s,C=c,T=u,E=d,ee=p,O=m,A=g,te=_):(S=c,C=s,T=d,E=u,ee=m,O=p,A=_,te=g)),w===0)return null;let ne=S/w,M=C/w,re=1/w,ie=T-ne*D,ae=E-M*D,oe=ee-ne*k,se=O-M*k,ce=A-ne*j,le=te-M*j,ue=ce*se-le*oe,N=ie*le-ae*ce,de=oe*ae-se*ie;if(r){if(ue<0||N<0||de<0)return null}else if((ue<0||N<0||de<0)&&(ue>0||N>0||de>0))return null;let fe=ue+N+de;if(fe===0)return null;let pe=re*(ue*D+N*k+de*j);return(fe>0?pe<0:pe>0)?null:this.at(pe/fe,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Zr=class extends kr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new U(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new $t,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Qr=new Ut,$r=new Xr,ei=new fr,ti=new V,ni=new V,ri=new V,ii=new V,ai=new V,oi=new V,si=new V,ci=new V,G=class extends _n{constructor(e=new br,t=new Zr){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){oi.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(ai.fromBufferAttribute(s,e),a?oi.addScaledVector(ai,r):oi.addScaledVector(ai.sub(t),r))}t.add(oi)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ei.copy(n.boundingSphere),ei.applyMatrix4(i),$r.copy(e.ray).recast(e.near),!(ei.containsPoint($r.origin)===!1&&($r.intersectSphere(ei,ti)===null||$r.origin.distanceToSquared(ti)>(e.far-e.near)**2))&&(Qr.copy(i).invert(),$r.copy(e.ray).applyMatrix4(Qr),(n.boundingBox===null||$r.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,$r)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=ui(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=ui(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=ui(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=ui(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function li(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;ci.copy(s),ci.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(ci);return l<n.near||l>n.far?null:{distance:l,point:ci.clone(),object:e}}function ui(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,ni),e.getVertexPosition(c,ri),e.getVertexPosition(l,ii);let u=li(e,t,n,r,ni,ri,ii,si);if(u){let e=new V;Vn.getBarycoord(si,ni,ri,ii,e),i&&(u.uv=Vn.getInterpolatedAttribute(i,s,c,l,e,new B)),a&&(u.uv1=Vn.getInterpolatedAttribute(a,s,c,l,e,new B)),o&&(u.normal=Vn.getInterpolatedAttribute(o,s,c,l,e,new V),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new V,materialIndex:0};Vn.getNormal(ni,ri,ii,t.normal),u.face=t,u.barycoord=e}return u}var di=class extends Lt{constructor(e=null,t=1,n=1,r,i,a,o,s,c=f,l=f,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},fi=class extends or{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},pi=new Ut,mi=new Ut,hi=[],gi=new Hn,_i=new Ut,vi=new G,yi=new fr,bi=class extends G{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new fi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,_i)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Hn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,pi),gi.copy(e.boundingBox).applyMatrix4(pi),this.boundingBox.union(gi)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new fr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,pi),yi.copy(e.boundingSphere).applyMatrix4(pi),this.boundingSphere.union(yi)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(vi.geometry=this.geometry,vi.material=this.material,vi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),yi.copy(this.boundingSphere),yi.applyMatrix4(n),e.ray.intersectsSphere(yi)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,pi),mi.multiplyMatrices(n,pi),vi.matrixWorld=mi,vi.raycast(e,hi);for(let e=0,n=hi.length;e<n;e++){let n=hi[e];n.instanceId=i,n.object=this,t.push(n)}hi.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new fi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new di(new Float32Array(r*this.count),r,this.count,re,w));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},xi=new fr,Si=new B(.5,.5),Ci=new V,wi=class{constructor(e=new Dr,t=new Dr,n=new Dr,r=new Dr,i=new Dr,a=new Dr){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=et,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),xi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),xi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(xi)}intersectsSprite(e){return xi.center.set(0,0,0),xi.radius=.7071067811865476+Si.distanceTo(e.center),xi.applyMatrix4(e.matrixWorld),this.intersectsSphere(xi)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Ci.x=r.normal.x>0?e.max.x:e.min.x,Ci.y=r.normal.y>0?e.max.y:e.min.y,Ci.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ci)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Ti=class extends Lt{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Ei=class extends Lt{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Di=class extends Lt{constructor(e,t,n=C,r,i,a,o=f,s=f,c,l=ne,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Nt(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Oi=class extends Di{constructor(e,t=C,n=301,r,i,a=f,o=f,s,c=ne){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},ki=class extends Lt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},K=class e extends br{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new W(c,3)),this.setAttribute(`normal`,new W(l,3)),this.setAttribute(`uv`,new W(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new V;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Ai=class e extends br{constructor(e=1,t=1,n=4,r=8,i=1){super(),this.type=`CapsuleGeometry`,this.parameters={radius:e,height:t,capSegments:n,radialSegments:r,heightSegments:i},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),r=Math.max(3,Math.floor(r)),i=Math.max(1,Math.floor(i));let a=[],o=[],s=[],c=[],l=t/2,u=Math.PI/2*e,d=t,f=2*u+d,p=n*2+i,m=r+1,h=new V,g=new V;for(let _=0;_<=p;_++){let v=0,y=0,b=0,x=0;if(_<=n){let t=_/n,r=t*Math.PI/2;y=-l-e*Math.cos(r),b=e*Math.sin(r),x=-e*Math.cos(r),v=t*u}else if(_<=n+i){let r=(_-n)/i;y=-l+r*t,b=e,x=0,v=u+r*d}else{let t=(_-n-i)/n,r=t*Math.PI/2;y=l+e*Math.sin(r),b=e*Math.cos(r),x=e*Math.sin(r),v=u+d+t*u}let S=Math.max(0,Math.min(1,v/f)),C=0;_===0?C=.5/r:_===p&&(C=-.5/r);for(let e=0;e<=r;e++){let t=e/r,n=t*Math.PI*2,i=Math.sin(n),a=Math.cos(n);g.x=-b*a,g.y=y,g.z=b*i,o.push(g.x,g.y,g.z),h.set(-b*a,x,b*i),h.normalize(),s.push(h.x,h.y,h.z),c.push(t+C,S)}if(_>0){let e=(_-1)*m;for(let t=0;t<r;t++){let n=e+t,r=e+t+1,i=_*m+t,o=_*m+t+1;a.push(n,r,i),a.push(r,o,i)}}}this.setIndex(a),this.setAttribute(`position`,new W(o,3)),this.setAttribute(`normal`,new W(s,3)),this.setAttribute(`uv`,new W(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}},ji=class e extends br{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new V,l=new B;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new W(a,3)),this.setAttribute(`normal`,new W(o,3)),this.setAttribute(`uv`,new W(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Mi=class e extends br{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new W(u,3)),this.setAttribute(`normal`,new W(d,3)),this.setAttribute(`uv`,new W(f,2));function _(){let a=new V,_=new V,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new B,m=new V,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ni=class e extends Mi{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Pi=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){L(`Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new B:new V);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new V,r=[],i=[],a=[],o=new V,s=new Ut;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new V)}i[0]=new V,a[0]=new V;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(z(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(z(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Fi=class extends Pi{constructor(e=0,t=0,n=1,r=1,i=0,a=Math.PI*2,o=!1,s=0){super(),this.isEllipseCurve=!0,this.type=`EllipseCurve`,this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=i,this.aEndAngle=a,this.aClockwise=o,this.aRotation=s}getPoint(e,t=new B){let n=t,r=Math.PI*2,i=this.aEndAngle-this.aStartAngle,a=Math.abs(i)<2**-52;for(;i<0;)i+=r;for(;i>r;)i-=r;i<2**-52&&(i=a?0:r),this.aClockwise===!0&&!a&&(i===r?i=-r:i-=r);let o=this.aStartAngle+e*i,s=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let e=Math.cos(this.aRotation),t=Math.sin(this.aRotation),n=s-this.aX,r=c-this.aY;s=n*e-r*t+this.aX,c=n*t+r*e+this.aY}return n.set(s,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Ii=class extends Fi{constructor(e,t,n,r,i,a){super(e,t,n,n,r,i,a),this.isArcCurve=!0,this.type=`ArcCurve`}};function Li(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var Ri=new V,zi=new V,Bi=new Li,Vi=new Li,Hi=new Li,Ui=class extends Pi{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new V){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(zi.subVectors(r[0],r[1]).add(r[0]),c=zi);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(Ri.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=Ri),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),Bi.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),Vi.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),Hi.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(Bi.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),Vi.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),Hi.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(Bi.calc(s),Vi.calc(s),Hi.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new V().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Wi(e,t,n,r,i){let a=(r-t)*.5,o=(i-n)*.5,s=e*e,c=e*s;return(2*n-2*r+a+o)*c+(-3*n+3*r-2*a-o)*s+a*e+n}function Gi(e,t){let n=1-e;return n*n*t}function Ki(e,t){return 2*(1-e)*e*t}function qi(e,t){return e*e*t}function Ji(e,t,n,r){return Gi(e,t)+Ki(e,n)+qi(e,r)}function Yi(e,t){let n=1-e;return n*n*n*t}function Xi(e,t){let n=1-e;return 3*n*n*e*t}function Zi(e,t){return 3*(1-e)*e*e*t}function Qi(e,t){return e*e*e*t}function $i(e,t,n,r,i){return Yi(e,t)+Xi(e,n)+Zi(e,r)+Qi(e,i)}var ea=class extends Pi{constructor(e=new B,t=new B,n=new B,r=new B){super(),this.isCubicBezierCurve=!0,this.type=`CubicBezierCurve`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new B){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set($i(e,r.x,i.x,a.x,o.x),$i(e,r.y,i.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ta=class extends Pi{constructor(e=new V,t=new V,n=new V,r=new V){super(),this.isCubicBezierCurve3=!0,this.type=`CubicBezierCurve3`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new V){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set($i(e,r.x,i.x,a.x,o.x),$i(e,r.y,i.y,a.y,o.y),$i(e,r.z,i.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},na=class extends Pi{constructor(e=new B,t=new B){super(),this.isLineCurve=!0,this.type=`LineCurve`,this.v1=e,this.v2=t}getPoint(e,t=new B){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new B){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ra=class extends Pi{constructor(e=new V,t=new V){super(),this.isLineCurve3=!0,this.type=`LineCurve3`,this.v1=e,this.v2=t}getPoint(e,t=new V){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new V){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ia=class extends Pi{constructor(e=new B,t=new B,n=new B){super(),this.isQuadraticBezierCurve=!0,this.type=`QuadraticBezierCurve`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new B){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(Ji(e,r.x,i.x,a.x),Ji(e,r.y,i.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},aa=class extends Pi{constructor(e=new V,t=new V,n=new V){super(),this.isQuadraticBezierCurve3=!0,this.type=`QuadraticBezierCurve3`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new V){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(Ji(e,r.x,i.x,a.x),Ji(e,r.y,i.y,a.y),Ji(e,r.z,i.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},oa=class extends Pi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type=`SplineCurve`,this.points=e}getPoint(e,t=new B){let n=t,r=this.points,i=(r.length-1)*e,a=Math.floor(i),o=i-a,s=r[a===0?a:a-1],c=r[a],l=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(Wi(o,s.x,c.x,l.x,u.x),Wi(o,s.y,c.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new B().fromArray(n))}return this}},sa=Object.freeze({__proto__:null,ArcCurve:Ii,CatmullRomCurve3:Ui,CubicBezierCurve:ea,CubicBezierCurve3:ta,EllipseCurve:Fi,LineCurve:na,LineCurve3:ra,QuadraticBezierCurve:ia,QuadraticBezierCurve3:aa,SplineCurve:oa}),ca=class extends Pi{constructor(){super(),this.type=`CurvePath`,this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?`LineCurve`:`LineCurve3`;this.curves.push(new sa[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),i=0;for(;i<r.length;){if(r[i]>=n){let e=r[i]-n,a=this.curves[i],o=a.getLength(),s=o===0?0:1-e/o;return a.getPointAt(s,t)}i++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,i=this.curves;r<i.length;r++){let a=i[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,s=a.getPoints(o);for(let e=0;e<s.length;e++){let r=s[e];n&&n.equals(r)||(t.push(r),n=r)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(new sa[n.type]().fromJSON(n))}return this}},la=class extends ca{constructor(e){super(),this.type=`Path`,this.currentPoint=new B,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new na(this.currentPoint.clone(),new B(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let i=new ia(this.currentPoint.clone(),new B(e,t),new B(n,r));return this.curves.push(i),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,i,a){let o=new ea(this.currentPoint.clone(),new B(e,t),new B(n,r),new B(i,a));return this.curves.push(o),this.currentPoint.set(i,a),this}splineThru(e){let t=new oa([this.currentPoint.clone()].concat(e));return this.curves.push(t),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,i,a){let o=this.currentPoint.x,s=this.currentPoint.y;return this.absarc(e+o,t+s,n,r,i,a),this}absarc(e,t,n,r,i,a){return this.absellipse(e,t,n,n,r,i,a),this}ellipse(e,t,n,r,i,a,o,s){let c=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(e+c,t+l,n,r,i,a,o,s),this}absellipse(e,t,n,r,i,a,o,s){let c=new Fi(e,t,n,r,i,a,o,s);if(this.curves.length>0){let e=c.getPoint(0);e.equals(this.currentPoint)||this.lineTo(e.x,e.y)}this.curves.push(c);let l=c.getPoint(1);return this.currentPoint.copy(l),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},ua=class extends la{constructor(e){super(e),this.uuid=ht(),this.type=`Shape`,this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(new la().fromJSON(n))}return this}};function da(e,t,n=2){let r=t&&t.length,i=r?t[0]*n:e.length,a=fa(e,0,i,n,!0),o=[];if(!a||a.next===a.prev)return o;let s,c,l;if(r&&(a=ya(e,t,a,n)),e.length>80*n){s=e[0],c=e[1];let t=s,r=c;for(let a=n;a<i;a+=n){let n=e[a],i=e[a+1];n<s&&(s=n),i<c&&(c=i),n>t&&(t=n),i>r&&(r=i)}l=Math.max(t-s,r-c),l=l===0?0:32767/l}return ma(a,o,n,s,c,l,0),o}function fa(e,t,n,r,i){let a;if(i===Ua(e,t,n,r)>0)for(let i=t;i<n;i+=r)a=Ba(i/r|0,e[i],e[i+1],a);else for(let i=n-r;i>=t;i-=r)a=Ba(i/r|0,e[i],e[i+1],a);return a&&Ma(a,a.next)&&(Va(a),a=a.next),a}function pa(e,t){if(!e)return e;t||(t=e);let n=e,r;do if(r=!1,!n.steiner&&(Ma(n,n.next)||ja(n.prev,n,n.next)===0)){if(Va(n),n=t=n.prev,n===n.next)break;r=!0}else n=n.next;while(r||n!==t);return t}function ma(e,t,n,r,i,a,o){if(!e)return;!o&&a&&wa(e,r,i,a);let s=e;for(;e.prev!==e.next;){let c=e.prev,l=e.next;if(a?ga(e,r,i,a):ha(e))t.push(c.i,e.i,l.i),Va(e),e=l.next,s=l.next;else if(e=l,e===s){o?o===1?(e=_a(pa(e),t),ma(e,t,n,r,i,a,2)):o===2&&va(e,t,n,r,i,a):ma(pa(e),t,n,r,i,a,1);break}}}function ha(e){let t=e.prev,n=e,r=e.next;if(ja(t,n,r)>=0)return!1;let i=t.x,a=n.x,o=r.x,s=t.y,c=n.y,l=r.y,u=Math.min(i,a,o),d=Math.min(s,c,l),f=Math.max(i,a,o),p=Math.max(s,c,l),m=r.next;for(;m!==t;){if(m.x>=u&&m.x<=f&&m.y>=d&&m.y<=p&&ka(i,s,a,c,o,l,m.x,m.y)&&ja(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function ga(e,t,n,r){let i=e.prev,a=e,o=e.next;if(ja(i,a,o)>=0)return!1;let s=i.x,c=a.x,l=o.x,u=i.y,d=a.y,f=o.y,p=Math.min(s,c,l),m=Math.min(u,d,f),h=Math.max(s,c,l),g=Math.max(u,d,f),_=Ea(p,m,t,n,r),v=Ea(h,g,t,n,r),y=e.prevZ,b=e.nextZ;for(;y&&y.z>=_&&b&&b.z<=v;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&ka(s,u,c,d,l,f,y.x,y.y)&&ja(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&ka(s,u,c,d,l,f,b.x,b.y)&&ja(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=_;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&ka(s,u,c,d,l,f,y.x,y.y)&&ja(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=v;){if(b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&ka(s,u,c,d,l,f,b.x,b.y)&&ja(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function _a(e,t){let n=e;do{let r=n.prev,i=n.next.next;!Ma(r,i)&&Na(r,n,n.next,i)&&La(r,i)&&La(i,r)&&(t.push(r.i,n.i,i.i),Va(n),Va(n.next),n=e=i),n=n.next}while(n!==e);return pa(n)}function va(e,t,n,r,i,a){let o=e;do{let e=o.next.next;for(;e!==o.prev;){if(o.i!==e.i&&Aa(o,e)){let s=za(o,e);o=pa(o,o.next),s=pa(s,s.next),ma(o,t,n,r,i,a,0),ma(s,t,n,r,i,a,0);return}e=e.next}o=o.next}while(o!==e)}function ya(e,t,n,r){let i=[];for(let n=0,a=t.length;n<a;n++){let o=fa(e,t[n]*r,n<a-1?t[n+1]*r:e.length,r,!1);o===o.next&&(o.steiner=!0),i.push(Da(o))}i.sort(ba);for(let e=0;e<i.length;e++)n=xa(i[e],n);return n}function ba(e,t){let n=e.x-t.x;return n===0&&(n=e.y-t.y,n===0&&(n=(e.next.y-e.y)/(e.next.x-e.x)-(t.next.y-t.y)/(t.next.x-t.x))),n}function xa(e,t){let n=Sa(e,t);if(!n)return t;let r=za(n,e);return pa(r,r.next),pa(n,n.next)}function Sa(e,t){let n=t,r=e.x,i=e.y,a=-1/0,o;if(Ma(e,n))return n;do{if(Ma(e,n.next))return n.next;if(i<=n.y&&i>=n.next.y&&n.next.y!==n.y){let e=n.x+(i-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(e<=r&&e>a&&(a=e,o=n.x<n.next.x?n:n.next,e===r))return o}n=n.next}while(n!==t);if(!o)return null;let s=o,c=o.x,l=o.y,u=1/0;n=o;do{if(r>=n.x&&n.x>=c&&r!==n.x&&Oa(i<l?r:a,i,c,l,i<l?a:r,i,n.x,n.y)){let t=Math.abs(i-n.y)/(r-n.x);La(n,e)&&(t<u||t===u&&(n.x>o.x||n.x===o.x&&Ca(o,n)))&&(o=n,u=t)}n=n.next}while(n!==s);return o}function Ca(e,t){return ja(e.prev,e,t.prev)<0&&ja(t.next,e,e.next)<0}function wa(e,t,n,r){let i=e;do i.z===0&&(i.z=Ea(i.x,i.y,t,n,r)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==e);i.prevZ.nextZ=null,i.prevZ=null,Ta(i)}function Ta(e){let t,n=1;do{let r=e,i;e=null;let a=null;for(t=0;r;){t++;let o=r,s=0;for(let e=0;e<n&&(s++,o=o.nextZ,o);e++);let c=n;for(;s>0||c>0&&o;)s!==0&&(c===0||!o||r.z<=o.z)?(i=r,r=r.nextZ,s--):(i=o,o=o.nextZ,c--),a?a.nextZ=i:e=i,i.prevZ=a,a=i;r=o}a.nextZ=null,n*=2}while(t>1);return e}function Ea(e,t,n,r,i){return e=(e-n)*i|0,t=(t-r)*i|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function Da(e){let t=e,n=e;do(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next;while(t!==e);return n}function Oa(e,t,n,r,i,a,o,s){return(i-o)*(t-s)>=(e-o)*(a-s)&&(e-o)*(r-s)>=(n-o)*(t-s)&&(n-o)*(a-s)>=(i-o)*(r-s)}function ka(e,t,n,r,i,a,o,s){return(e!==o||t!==s)&&Oa(e,t,n,r,i,a,o,s)}function Aa(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!Ia(e,t)&&(La(e,t)&&La(t,e)&&Ra(e,t)&&(ja(e.prev,e,t.prev)||ja(e,t.prev,t))||Ma(e,t)&&ja(e.prev,e,e.next)>0&&ja(t.prev,t,t.next)>0)}function ja(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function Ma(e,t){return e.x===t.x&&e.y===t.y}function Na(e,t,n,r){let i=Fa(ja(e,t,n)),a=Fa(ja(e,t,r)),o=Fa(ja(n,r,e)),s=Fa(ja(n,r,t));return!!(i!==a&&o!==s||i===0&&Pa(e,n,t)||a===0&&Pa(e,r,t)||o===0&&Pa(n,e,r)||s===0&&Pa(n,t,r))}function Pa(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function Fa(e){return e>0?1:e<0?-1:0}function Ia(e,t){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&Na(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}function La(e,t){return ja(e.prev,e,e.next)<0?ja(e,t,e.next)>=0&&ja(e,e.prev,t)>=0:ja(e,t,e.prev)<0||ja(e,e.next,t)<0}function Ra(e,t){let n=e,r=!1,i=(e.x+t.x)/2,a=(e.y+t.y)/2;do n.y>a!=n.next.y>a&&n.next.y!==n.y&&i<(n.next.x-n.x)*(a-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next;while(n!==e);return r}function za(e,t){let n=Ha(e.i,e.x,e.y),r=Ha(t.i,t.x,t.y),i=e.next,a=t.prev;return e.next=t,t.prev=e,n.next=i,i.prev=n,r.next=n,n.prev=r,a.next=r,r.prev=a,r}function Ba(e,t,n,r){let i=Ha(e,t,n);return r?(i.next=r.next,i.prev=r,r.next.prev=i,r.next=i):(i.prev=i,i.next=i),i}function Va(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function Ha(e,t,n){return{i:e,x:t,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Ua(e,t,n,r){let i=0;for(let a=t,o=n-r;a<n;a+=r)i+=(e[o]-e[a])*(e[a+1]+e[o+1]),o=a;return i}var Wa=class{static triangulate(e,t,n=2){return da(e,t,n)}},Ga=class e{static area(e){let t=e.length,n=0;for(let r=t-1,i=0;i<t;r=i++)n+=e[r].x*e[i].y-e[i].x*e[r].y;return n*.5}static isClockWise(t){return e.area(t)<0}static triangulateShape(e,t){let n=[],r=[],i=[];Ka(e),qa(n,e);let a=e.length;t.forEach(Ka);for(let e=0;e<t.length;e++)r.push(a),a+=t[e].length,qa(n,t[e]);let o=Wa.triangulate(n,r);for(let e=0;e<o.length;e+=3)i.push(o.slice(e,e+3));return i}};function Ka(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function qa(e,t){for(let n=0;n<t.length;n++)e.push(t[n].x),e.push(t[n].y)}var Ja=class e extends br{constructor(e=new ua([new B(.5,.5),new B(-.5,.5),new B(-.5,-.5),new B(.5,-.5)]),t={}){super(),this.type=`ExtrudeGeometry`,this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,r=[],i=[];for(let t=0,n=e.length;t<n;t++){let n=e[t];a(n)}this.setAttribute(`position`,new W(r,3)),this.setAttribute(`uv`,new W(i,2)),this.computeVertexNormals();function a(e){let a=[],o=t.curveSegments===void 0?12:t.curveSegments,s=t.steps===void 0?1:t.steps,c=t.depth===void 0?1:t.depth,l=t.bevelEnabled===void 0||t.bevelEnabled,u=t.bevelThickness===void 0?.2:t.bevelThickness,d=t.bevelSize===void 0?u-.1:t.bevelSize,f=t.bevelOffset===void 0?0:t.bevelOffset,p=t.bevelSegments===void 0?3:t.bevelSegments,m=t.extrudePath,h=t.UVGenerator===void 0?Ya:t.UVGenerator,g,_=!1,v,y,b,x;if(m){g=m.getSpacedPoints(s),_=!0,l=!1;let e=m.isCatmullRomCurve3?m.closed:!1;v=m.computeFrenetFrames(s,e),y=new V,b=new V,x=new V}l||(p=0,u=0,d=0,f=0);let S=e.extractPoints(o),C=S.shape,w=S.holes;if(!Ga.isClockWise(C)){C=C.reverse();for(let e=0,t=w.length;e<t;e++){let t=w[e];Ga.isClockWise(t)&&(w[e]=t.reverse())}}function T(e){let t=e[0];for(let n=1;n<=e.length;n++){let r=n%e.length,i=e[r],a=i.x-t.x,o=i.y-t.y,s=a*a+o*o,c=Math.max(Math.abs(i.x),Math.abs(i.y),Math.abs(t.x),Math.abs(t.y));s<=10000000000000001e-36*c*c?(e.splice(r,1),n--):t=i}}T(C),w.forEach(T);let E=w.length,D=C;for(let e=0;e<E;e++){let t=w[e];C=C.concat(t)}function ee(e,t,n){return t||R(`ExtrudeGeometry: vec does not exist`),e.clone().addScaledVector(t,n)}let O=C.length;function k(e,t,n){let r,i,a,o=e.x-t.x,s=e.y-t.y,c=n.x-e.x,l=n.y-e.y,u=o*o+s*s,d=o*l-s*c;if(Math.abs(d)>2**-52){let d=Math.sqrt(u),f=Math.sqrt(c*c+l*l),p=t.x-s/d,m=t.y+o/d,h=n.x-l/f,g=n.y+c/f,_=((h-p)*l-(g-m)*c)/(o*l-s*c);r=p+o*_-e.x,i=m+s*_-e.y;let v=r*r+i*i;if(v<=2)return new B(r,i);a=Math.sqrt(v/2)}else{let e=!1;o>2**-52?c>2**-52&&(e=!0):o<-(2**-52)?c<-(2**-52)&&(e=!0):Math.sign(s)===Math.sign(l)&&(e=!0),e?(r=-s,i=o,a=Math.sqrt(u)):(r=o,i=s,a=Math.sqrt(u/2))}return new B(r/a,i/a)}let A=[];for(let e=0,t=D.length,n=t-1,r=e+1;e<t;e++,n++,r++)n===t&&(n=0),r===t&&(r=0),A[e]=k(D[e],D[n],D[r]);let te=[],j,ne=A.concat();for(let e=0,t=E;e<t;e++){let t=w[e];j=[];for(let e=0,n=t.length,r=n-1,i=e+1;e<n;e++,r++,i++)r===n&&(r=0),i===n&&(i=0),j[e]=k(t[e],t[r],t[i]);te.push(j),ne=ne.concat(j)}let M;if(p===0)M=Ga.triangulateShape(D,w);else{let e=[],t=[];for(let n=0;n<p;n++){let r=n/p,i=u*Math.cos(r*Math.PI/2),a=d*Math.sin(r*Math.PI/2)+f;for(let t=0,n=D.length;t<n;t++){let n=ee(D[t],A[t],a);ce(n.x,n.y,-i),r===0&&e.push(n)}for(let e=0,n=E;e<n;e++){let n=w[e];j=te[e];let o=[];for(let e=0,t=n.length;e<t;e++){let t=ee(n[e],j[e],a);ce(t.x,t.y,-i),r===0&&o.push(t)}r===0&&t.push(o)}}M=Ga.triangulateShape(e,t)}let re=M.length,ie=d+f;for(let e=0;e<O;e++){let t=l?ee(C[e],ne[e],ie):C[e];_?(b.copy(v.normals[0]).multiplyScalar(t.x),y.copy(v.binormals[0]).multiplyScalar(t.y),x.copy(g[0]).add(b).add(y),ce(x.x,x.y,x.z)):ce(t.x,t.y,0)}for(let e=1;e<=s;e++)for(let t=0;t<O;t++){let n=l?ee(C[t],ne[t],ie):C[t];_?(b.copy(v.normals[e]).multiplyScalar(n.x),y.copy(v.binormals[e]).multiplyScalar(n.y),x.copy(g[e]).add(b).add(y),ce(x.x,x.y,x.z)):ce(n.x,n.y,c/s*e)}for(let e=p-1;e>=0;e--){let t=e/p,n=u*Math.cos(t*Math.PI/2),r=d*Math.sin(t*Math.PI/2)+f;for(let e=0,t=D.length;e<t;e++){let t=ee(D[e],A[e],r);ce(t.x,t.y,c+n)}for(let e=0,t=w.length;e<t;e++){let t=w[e];j=te[e];for(let e=0,i=t.length;e<i;e++){let i=ee(t[e],j[e],r);_?ce(i.x,i.y+g[s-1].y,g[s-1].x+n):ce(i.x,i.y,c+n)}}}ae(),oe();function ae(){let e=r.length/3;if(l){let e=0,t=O*e;for(let e=0;e<re;e++){let n=M[e];le(n[2]+t,n[1]+t,n[0]+t)}e=s+p*2,t=O*e;for(let e=0;e<re;e++){let n=M[e];le(n[0]+t,n[1]+t,n[2]+t)}}else{for(let e=0;e<re;e++){let t=M[e];le(t[2],t[1],t[0])}for(let e=0;e<re;e++){let t=M[e];le(t[0]+O*s,t[1]+O*s,t[2]+O*s)}}n.addGroup(e,r.length/3-e,0)}function oe(){let e=r.length/3,t=0;se(D,t),t+=D.length;for(let e=0,n=w.length;e<n;e++){let n=w[e];se(n,t),t+=n.length}n.addGroup(e,r.length/3-e,1)}function se(e,t){let n=e.length;for(;--n>=0;){let r=n,i=n-1;i<0&&(i=e.length-1);for(let e=0,n=s+p*2;e<n;e++){let n=O*e,a=O*(e+1);ue(t+r+n,t+i+n,t+i+a,t+r+a)}}}function ce(e,t,n){a.push(e),a.push(t),a.push(n)}function le(e,t,i){N(e),N(t),N(i);let a=r.length/3,o=h.generateTopUV(n,r,a-3,a-2,a-1);de(o[0]),de(o[1]),de(o[2])}function ue(e,t,i,a){N(e),N(t),N(a),N(t),N(i),N(a);let o=r.length/3,s=h.generateSideWallUV(n,r,o-6,o-3,o-2,o-1);de(s[0]),de(s[1]),de(s[3]),de(s[1]),de(s[2]),de(s[3])}function N(e){r.push(a[e*3+0]),r.push(a[e*3+1]),r.push(a[e*3+2])}function de(e){i.push(e.x),i.push(e.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Xa(t,n,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new sa[i.type]().fromJSON(i)),new e(r,t.options)}},Ya={generateTopUV:function(e,t,n,r,i){let a=t[n*3],o=t[n*3+1],s=t[r*3],c=t[r*3+1],l=t[i*3],u=t[i*3+1];return[new B(a,o),new B(s,c),new B(l,u)]},generateSideWallUV:function(e,t,n,r,i,a){let o=t[n*3],s=t[n*3+1],c=t[n*3+2],l=t[r*3],u=t[r*3+1],d=t[r*3+2],f=t[i*3],p=t[i*3+1],m=t[i*3+2],h=t[a*3],g=t[a*3+1],_=t[a*3+2];return Math.abs(s-u)<Math.abs(o-l)?[new B(o,1-c),new B(l,1-d),new B(f,1-m),new B(h,1-_)]:[new B(s,1-c),new B(u,1-d),new B(p,1-m),new B(g,1-_)]}};function Xa(e,t,n){if(n.shapes=[],Array.isArray(e))for(let t=0,r=e.length;t<r;t++){let r=e[t];n.shapes.push(r.uuid)}else n.shapes.push(e.uuid);return n.options=Object.assign({},t),t.extrudePath!==void 0&&(n.options.extrudePath=t.extrudePath.toJSON()),n}var Za=class e extends br{constructor(e=[new B(0,-.5),new B(.5,0),new B(0,.5)],t=12,n=0,r=Math.PI*2){super(),this.type=`LatheGeometry`,this.parameters={points:e,segments:t,phiStart:n,phiLength:r},t=Math.floor(t),r=z(r,0,Math.PI*2);let i=[],a=[],o=[],s=[],c=[],l=1/t,u=new V,d=new B,f=new V,p=new V,m=new V,h=0,g=0;for(let t=0;t<=e.length-1;t++)switch(t){case 0:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,m.copy(f),f.normalize(),s.push(f.x,f.y,f.z);break;case e.length-1:s.push(m.x,m.y,m.z);break;default:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,p.copy(f),f.x+=m.x,f.y+=m.y,f.z+=m.z,f.normalize(),s.push(f.x,f.y,f.z),m.copy(p)}for(let i=0;i<=t;i++){let f=n+i*l*r,p=Math.sin(f),m=Math.cos(f);for(let n=0;n<=e.length-1;n++){u.x=e[n].x*p,u.y=e[n].y,u.z=e[n].x*m,a.push(u.x,u.y,u.z),d.x=i/t,d.y=n/(e.length-1),o.push(d.x,d.y);let r=s[3*n+0]*p,l=s[3*n+1],f=s[3*n+0]*m;c.push(r,l,f)}}for(let n=0;n<t;n++)for(let t=0;t<e.length-1;t++){let r=t+n*e.length,a=r,o=r+e.length,s=r+e.length+1,c=r+1;i.push(a,o,c),i.push(s,c,o)}this.setIndex(i),this.setAttribute(`position`,new W(a,3)),this.setAttribute(`uv`,new W(o,2)),this.setAttribute(`normal`,new W(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.points,t.segments,t.phiStart,t.phiLength)}},Qa=class e extends br{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new W(p,3)),this.setAttribute(`normal`,new W(m,3)),this.setAttribute(`uv`,new W(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},$a=class e extends br{constructor(e=.5,t=1,n=32,r=1,i=0,a=Math.PI*2){super(),this.type=`RingGeometry`,this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:i,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);let o=[],s=[],c=[],l=[],u=e,d=(t-e)/r,f=new V,p=new B;for(let e=0;e<=r;e++){for(let e=0;e<=n;e++){let r=i+e/n*a;f.x=u*Math.cos(r),f.y=u*Math.sin(r),s.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,l.push(p.x,p.y)}u+=d}for(let e=0;e<r;e++){let t=e*(n+1);for(let e=0;e<n;e++){let r=e+t,i=r,a=r+n+1,s=r+n+2,c=r+1;o.push(i,a,c),o.push(a,s,c)}}this.setIndex(o),this.setAttribute(`position`,new W(s,3)),this.setAttribute(`normal`,new W(c,3)),this.setAttribute(`uv`,new W(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},eo=class e extends br{constructor(e=new ua([new B(0,.5),new B(-.5,-.5),new B(.5,-.5)]),t=12){super(),this.type=`ShapeGeometry`,this.parameters={shapes:e,curveSegments:t};let n=[],r=[],i=[],a=[],o=0,s=0;if(Array.isArray(e)===!1)c(e);else for(let t=0;t<e.length;t++)c(e[t]),this.addGroup(o,s,t),o+=s,s=0;this.setIndex(n),this.setAttribute(`position`,new W(r,3)),this.setAttribute(`normal`,new W(i,3)),this.setAttribute(`uv`,new W(a,2));function c(e){let o=r.length/3,c=e.extractPoints(t),l=c.shape,u=c.holes;Ga.isClockWise(l)===!1&&(l=l.reverse());for(let e=0,t=u.length;e<t;e++){let t=u[e];Ga.isClockWise(t)===!0&&(u[e]=t.reverse())}let d=Ga.triangulateShape(l,u);for(let e=0,t=u.length;e<t;e++){let t=u[e];l=l.concat(t)}for(let e=0,t=l.length;e<t;e++){let t=l[e];r.push(t.x,t.y,0),i.push(0,0,1),a.push(t.x,t.y)}for(let e=0,t=d.length;e<t;e++){let t=d[e],r=t[0]+o,i=t[1]+o,a=t[2]+o;n.push(r,i,a),s+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return to(t,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}return new e(r,t.curveSegments)}};function to(e,t){if(t.shapes=[],Array.isArray(e))for(let n=0,r=e.length;n<r;n++){let r=e[n];t.shapes.push(r.uuid)}else t.shapes.push(e.uuid);return t}var no=class e extends br{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new V,d=new V,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new W(p,3)),this.setAttribute(`normal`,new W(m,3)),this.setAttribute(`uv`,new W(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},ro=class e extends br{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2,a=0,o=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i,thetaStart:a,thetaLength:o},n=Math.floor(n),r=Math.floor(r);let s=[],c=[],l=[],u=[],d=new V,f=new V,p=new V;for(let s=0;s<=n;s++){let m=a+s/n*o;for(let a=0;a<=r;a++){let o=a/r*i;f.x=(e+t*Math.cos(m))*Math.cos(o),f.y=(e+t*Math.cos(m))*Math.sin(o),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(o),d.y=e*Math.sin(o),p.subVectors(f,d).normalize(),l.push(p.x,p.y,p.z),u.push(a/r),u.push(s/n)}}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,a=(r+1)*(e-1)+t,o=(r+1)*e+t;s.push(n,i,o),s.push(i,a,o)}this.setIndex(s),this.setAttribute(`position`,new W(c,3)),this.setAttribute(`normal`,new W(l,3)),this.setAttribute(`uv`,new W(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}},io=class e extends br{constructor(e=new aa(new V(-1,-1,0),new V(-1,1,0),new V(1,1,0)),t=64,n=1,r=8,i=!1){super(),this.type=`TubeGeometry`,this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:r,closed:i};let a=e.computeFrenetFrames(t,i);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new V,s=new V,c=new B,l=new V,u=[],d=[],f=[],p=[];m(),this.setIndex(p),this.setAttribute(`position`,new W(u,3)),this.setAttribute(`normal`,new W(d,3)),this.setAttribute(`uv`,new W(f,2));function m(){for(let e=0;e<t;e++)h(e);h(i===!1?t:0),_(),g()}function h(i){l=e.getPointAt(i/t,l);let c=a.normals[i],f=a.binormals[i];for(let e=0;e<=r;e++){let t=e/r*Math.PI*2,i=Math.sin(t),a=-Math.cos(t);s.x=a*c.x+i*f.x,s.y=a*c.y+i*f.y,s.z=a*c.z+i*f.z,s.normalize(),d.push(s.x,s.y,s.z),o.x=l.x+n*s.x,o.y=l.y+n*s.y,o.z=l.z+n*s.z,u.push(o.x,o.y,o.z)}}function g(){for(let e=1;e<=t;e++)for(let t=1;t<=r;t++){let n=(r+1)*(e-1)+(t-1),i=(r+1)*e+(t-1),a=(r+1)*e+t,o=(r+1)*(e-1)+t;p.push(n,i,o),p.push(i,a,o)}}function _(){for(let e=0;e<=t;e++)for(let n=0;n<=r;n++)c.x=e/t,c.y=n/r,f.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(t){return new e(new sa[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}};function ao(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(so(i))i.isRenderTargetTexture?(L(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(so(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function oo(e){let t={};for(let n=0;n<e.length;n++){let r=ao(e[n]);for(let e in r)t[e]=r[e]}return t}function so(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function co(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function lo(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Dt.workingColorSpace}var uo={clone:ao,merge:oo},fo=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,po=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,mo=class extends kr{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=fo,this.fragmentShader=po,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ao(e.uniforms),this.uniformsGroups=co(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new U().setHex(r.value);break;case`v2`:this.uniforms[n].value=new B().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new V().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Rt().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new H().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new Ut().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},ho=class extends mo{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},go=class extends kr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new U(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new U(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new B(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new $t,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},_o=class extends kr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=qe,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},vo=class extends kr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function yo(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function bo(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var xo=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},So=class extends xo{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:We,endingEnd:We}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Ge:i=e,o=2*t-n;break;case Ke:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case Ge:a=e,s=2*n-t;break;case Ke:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Co=class extends xo{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},wo=class extends xo{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},To=class extends xo{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=Oo(n,t,g,y,r);i[p]=Eo(x,o,_,b,m)}return i}};function Eo(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function Do(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function Oo(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=Eo(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=Do(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var ko=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=yo(t,this.TimeBufferType),this.values=yo(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:yo(e.times,Array),values:yo(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),bo(e.settings)&&(n.settings={inTangents:yo(e.settings.inTangents,Array),outTangents:yo(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new wo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Co(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new So(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new To(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Be:t=this.InterpolantFactoryMethodDiscrete;break;case Ve:t=this.InterpolantFactoryMethodLinear;break;case He:t=this.InterpolantFactoryMethodSmooth;break;case Ue:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return L(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Be;case this.InterpolantFactoryMethodLinear:return Ve;case this.InterpolantFactoryMethodSmooth:return He;case this.InterpolantFactoryMethodBezier:return Ue}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;bo(this.settings)&&(Ao(this.settings.inTangents,e),Ao(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(R(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(R(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){R(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){R(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&nt(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){R(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===He,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,bo(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Ao(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}ko.prototype.ValueTypeName=``,ko.prototype.TimeBufferType=Float32Array,ko.prototype.ValueBufferType=Float32Array,ko.prototype.DefaultInterpolation=Ve;var jo=class extends ko{constructor(e,t,n){super(e,t,n)}};jo.prototype.ValueTypeName=`bool`,jo.prototype.ValueBufferType=Array,jo.prototype.DefaultInterpolation=Be,jo.prototype.InterpolantFactoryMethodLinear=void 0,jo.prototype.InterpolantFactoryMethodSmooth=void 0;var Mo=class extends ko{constructor(e,t,n,r){super(e,t,n,r)}};Mo.prototype.ValueTypeName=`color`;var No=class extends ko{constructor(e,t,n,r){super(e,t,n,r)}};No.prototype.ValueTypeName=`number`;var Po=class extends xo{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)bt.slerpFlat(i,0,a,c-o,a,c,s);return i}},Fo=class extends ko{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new Po(this.times,this.values,this.getValueSize(),e)}};Fo.prototype.ValueTypeName=`quaternion`,Fo.prototype.InterpolantFactoryMethodSmooth=void 0;var Io=class extends ko{constructor(e,t,n){super(e,t,n)}};Io.prototype.ValueTypeName=`string`,Io.prototype.ValueBufferType=Array,Io.prototype.DefaultInterpolation=Be,Io.prototype.InterpolantFactoryMethodLinear=void 0,Io.prototype.InterpolantFactoryMethodSmooth=void 0;var Lo=class extends ko{constructor(e,t,n,r){super(e,t,n,r)}};Lo.prototype.ValueTypeName=`vector`;var Ro=class extends _n{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new U(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},zo=class extends Ro{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(_n.DEFAULT_UP),this.updateMatrix(),this.groundColor=new U(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Bo=new Ut,Vo=new V,Ho=new V,Uo=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new B(512,512),this.mapType=v,this.map=null,this.mapPass=null,this.matrix=new Ut,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new wi,this._frameExtents=new B(1,1),this._viewportCount=1,this._viewports=[new Rt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Vo.setFromMatrixPosition(e.matrixWorld),t.position.copy(Vo),Ho.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ho),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){Bo.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Bo,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Bo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Wo=new V,Go=new bt,Ko=new V,qo=class extends _n{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new Ut,this.projectionMatrix=new Ut,this.projectionMatrixInverse=new Ut,this.coordinateSystem=et,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Wo,Go,Ko),Ko.x===1&&Ko.y===1&&Ko.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Wo,Go,Ko.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Wo,Go,Ko),Ko.x===1&&Ko.y===1&&Ko.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Wo,Go,Ko.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Jo=new V,Yo=new B,Xo=new B,Zo=class extends qo{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=mt*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(pt*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return mt*2*Math.atan(Math.tan(pt*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Jo.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Jo.x,Jo.y).multiplyScalar(-e/Jo.z),Jo.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Jo.x,Jo.y).multiplyScalar(-e/Jo.z)}getViewSize(e,t){return this.getViewBounds(e,Yo,Xo),t.subVectors(Xo,Yo)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(pt*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Qo=class extends qo{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},$o=class extends Uo{constructor(){super(new Qo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},es=class extends Ro{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(_n.DEFAULT_UP),this.updateMatrix(),this.target=new _n,this.shadow=new $o}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},ts=-90,ns=1,rs=class extends _n{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Zo(ts,ns,e,t);r.layers=this.layers,this.add(r);let i=new Zo(ts,ns,e,t);i.layers=this.layers,this.add(i);let a=new Zo(ts,ns,e,t);a.layers=this.layers,this.add(a);let o=new Zo(ts,ns,e,t);o.layers=this.layers,this.add(o);let s=new Zo(ts,ns,e,t);s.layers=this.layers,this.add(s);let c=new Zo(ts,ns,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},is=class extends Zo{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},as=`\\[\\]\\.:\\/`,os=RegExp(`[\\[\\]\\.:\\/]`,`g`),ss=`[^\\[\\]\\.:\\/]`,cs=`[^`+as.replace(`\\.`,``)+`]`,ls=`((?:WC+[\\/:])*)`.replace(`WC`,ss),us=`(WCOD+)?`.replace(`WCOD`,cs),ds=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,ss),fs=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,ss),ps=RegExp(`^`+ls+us+ds+fs+`$`),ms=[`material`,`materials`,`bones`,`map`],hs=class{constructor(e,t,n){let r=n||gs.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},gs=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(os,``)}static parseTrackName(e){let t=ps.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);ms.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){L(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){R(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){R(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){R(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){R(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){R(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){R(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){R(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;R(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){R(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){R(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};gs.Composite=hs,gs.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},gs.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},gs.prototype.GetterByBindingType=[gs.prototype._getValue_direct,gs.prototype._getValue_array,gs.prototype._getValue_arrayElement,gs.prototype._getValue_toArray],gs.prototype.SetterByBindingTypeAndVersioning=[[gs.prototype._setValue_direct,gs.prototype._setValue_direct_setNeedsUpdate,gs.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[gs.prototype._setValue_array,gs.prototype._setValue_array_setNeedsUpdate,gs.prototype._setValue_array_setMatrixWorldNeedsUpdate],[gs.prototype._setValue_arrayElement,gs.prototype._setValue_arrayElement_setNeedsUpdate,gs.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[gs.prototype._setValue_fromArray,gs.prototype._setValue_fromArray_setNeedsUpdate,gs.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var _s=new Ut,vs=class{constructor(e,t,n=0,r=1/0){this.ray=new Xr(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new en,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):R(`Raycaster: Unsupported camera type: `+t.type)}setFromXRController(e){return _s.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(_s),this}intersectObject(e,t=!0,n=[]){return bs(e,this,n,t),n.sort(ys),n}intersectObjects(e,t=!0,n=[]){for(let r=0,i=e.length;r<i;r++)bs(e[r],this,n,t);return n.sort(ys),n}};function ys(e,t){return e.distance-t.distance}function bs(e,t,n,r){let i=!0;if(e.layers.test(t.layers)&&e.raycast(t,n)===!1&&(i=!1),i===!0&&r===!0){let r=e.children;for(let e=0,i=r.length;e<i;e++)bs(r[e],t,n,!0)}}var xs=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,L(`Clock: This module has been deprecated. Please use THREE.Timer instead.`)}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};a=class{constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}},a.prototype.isMatrix2=!0;function Ss(e,t,n,r){let i=Cs(r);switch(n){case A:return e*t;case re:return e*t/i.components*i.byteLength;case ie:return e*t/i.components*i.byteLength;case ae:return e*t*2/i.components*i.byteLength;case oe:return e*t*2/i.components*i.byteLength;case te:return e*t*3/i.components*i.byteLength;case j:return e*t*4/i.components*i.byteLength;case se:return e*t*4/i.components*i.byteLength;case ce:case le:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case ue:case N:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case fe:case me:return Math.max(e,16)*Math.max(t,8)/4;case de:case pe:return Math.max(e,8)*Math.max(t,8)/2;case he:case ge:case ve:case ye:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case _e:case be:case xe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Se:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Ce:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case we:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case Te:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case Ee:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case De:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case Oe:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case ke:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case Ae:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case je:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Me:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Ne:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Pe:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case P:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Fe:case Ie:case Le:return Math.ceil(e/4)*Math.ceil(t/4)*16;case F:case Re:return Math.ceil(e/4)*Math.ceil(t/4)*8;case I:case ze:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Cs(e){switch(e){case v:case y:return{byteLength:1,components:1};case x:case b:case T:return{byteLength:2,components:1};case E:case D:return{byteLength:2,components:4};case C:case S:case w:return{byteLength:4,components:1};case O:case k:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?L(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);function ws(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Ts(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Es={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},q={common:{diffuse:{value:new U(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new H},alphaMap:{value:null},alphaMapTransform:{value:new H},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new H}},envmap:{envMap:{value:null},envMapRotation:{value:new H},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new H}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new H}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new H},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new H},normalScale:{value:new B(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new H},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new H}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new H}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new H}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new U(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new V},probesMax:{value:new V},probesResolution:{value:new V}},points:{diffuse:{value:new U(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new H},alphaTest:{value:0},uvTransform:{value:new H}},sprite:{diffuse:{value:new U(16777215)},opacity:{value:1},center:{value:new B(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new H},alphaMap:{value:null},alphaMapTransform:{value:new H},alphaTest:{value:0}}},Ds={basic:{uniforms:oo([q.common,q.specularmap,q.envmap,q.aomap,q.lightmap,q.fog]),vertexShader:Es.meshbasic_vert,fragmentShader:Es.meshbasic_frag},lambert:{uniforms:oo([q.common,q.specularmap,q.envmap,q.aomap,q.lightmap,q.emissivemap,q.bumpmap,q.normalmap,q.displacementmap,q.fog,q.lights,{emissive:{value:new U(0)},envMapIntensity:{value:1}}]),vertexShader:Es.meshlambert_vert,fragmentShader:Es.meshlambert_frag},phong:{uniforms:oo([q.common,q.specularmap,q.envmap,q.aomap,q.lightmap,q.emissivemap,q.bumpmap,q.normalmap,q.displacementmap,q.fog,q.lights,{emissive:{value:new U(0)},specular:{value:new U(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Es.meshphong_vert,fragmentShader:Es.meshphong_frag},standard:{uniforms:oo([q.common,q.envmap,q.aomap,q.lightmap,q.emissivemap,q.bumpmap,q.normalmap,q.displacementmap,q.roughnessmap,q.metalnessmap,q.fog,q.lights,{emissive:{value:new U(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Es.meshphysical_vert,fragmentShader:Es.meshphysical_frag},toon:{uniforms:oo([q.common,q.aomap,q.lightmap,q.emissivemap,q.bumpmap,q.normalmap,q.displacementmap,q.gradientmap,q.fog,q.lights,{emissive:{value:new U(0)}}]),vertexShader:Es.meshtoon_vert,fragmentShader:Es.meshtoon_frag},matcap:{uniforms:oo([q.common,q.bumpmap,q.normalmap,q.displacementmap,q.fog,{matcap:{value:null}}]),vertexShader:Es.meshmatcap_vert,fragmentShader:Es.meshmatcap_frag},points:{uniforms:oo([q.points,q.fog]),vertexShader:Es.points_vert,fragmentShader:Es.points_frag},dashed:{uniforms:oo([q.common,q.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Es.linedashed_vert,fragmentShader:Es.linedashed_frag},depth:{uniforms:oo([q.common,q.displacementmap]),vertexShader:Es.depth_vert,fragmentShader:Es.depth_frag},normal:{uniforms:oo([q.common,q.bumpmap,q.normalmap,q.displacementmap,{opacity:{value:1}}]),vertexShader:Es.meshnormal_vert,fragmentShader:Es.meshnormal_frag},sprite:{uniforms:oo([q.sprite,q.fog]),vertexShader:Es.sprite_vert,fragmentShader:Es.sprite_frag},background:{uniforms:{uvTransform:{value:new H},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Es.background_vert,fragmentShader:Es.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new H}},vertexShader:Es.backgroundCube_vert,fragmentShader:Es.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Es.cube_vert,fragmentShader:Es.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Es.equirect_vert,fragmentShader:Es.equirect_frag},distance:{uniforms:oo([q.common,q.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Es.distance_vert,fragmentShader:Es.distance_frag},shadow:{uniforms:oo([q.lights,q.fog,{color:{value:new U(0)},opacity:{value:1}}]),vertexShader:Es.shadow_vert,fragmentShader:Es.shadow_frag}};Ds.physical={uniforms:oo([Ds.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new H},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new H},clearcoatNormalScale:{value:new B(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new H},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new H},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new H},sheen:{value:0},sheenColor:{value:new U(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new H},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new H},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new H},transmissionSamplerSize:{value:new B},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new H},attenuationDistance:{value:0},attenuationColor:{value:new U(0)},specularColor:{value:new U(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new H},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new H},anisotropyVector:{value:new B},anisotropyMap:{value:null},anisotropyMapTransform:{value:new H}}]),vertexShader:Es.meshphysical_vert,fragmentShader:Es.meshphysical_frag};var Os={r:0,b:0,g:0},ks=new Ut,As=new H;As.set(-1,0,0,0,1,0,0,0,1);function js(e,t,n,r,i,a){let o=new U(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new G(new K(1,1,1),new mo({name:`BackgroundCubeMaterial`,uniforms:ao(Ds.backgroundCube.uniforms),vertexShader:Ds.backgroundCube.vertexShader,fragmentShader:Ds.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(ks.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(As),l.material.toneMapped=Dt.getTransfer(i.colorSpace)!==Ze,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new G(new Qa(2,2),new mo({name:`BackgroundMaterial`,uniforms:ao(Ds.background.uniforms),vertexShader:Ds.background.vertexShader,fragmentShader:Ds.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=Dt.getTransfer(i.colorSpace)!==Ze,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(Os,lo(e)),n.buffers.color.setClear(Os.r,Os.g,Os.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function Ms(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Ns(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Ps(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(L(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&L(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Fs(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Dr,s=new H,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var Is=4,Ls=6,Rs=20,zs=256,Bs=new Qo,Vs=new U,Hs=null,Us=0,Ws=0,Gs=!1,Ks=new V,qs=new V,Js=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=Ks}=i;Hs=this._renderer.getRenderTarget(),Us=this._renderer.getActiveCubeFace(),Ws=this._renderer.getActiveMipmapLevel(),Gs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=tc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ec(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Hs,Us,Ws),this._renderer.xr.enabled=Gs,e.scissorTest=!1,Zs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Hs=this._renderer.getRenderTarget(),Us=this._renderer.getActiveCubeFace(),Ws=this._renderer.getActiveMipmapLevel(),Gs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:h,minFilter:h,generateMipmaps:!1,type:T,format:j,colorSpace:Ye,depthBuffer:!1},r=Xs(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Xs(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Ys(r)),this._blurMaterial=$s(r,e,t),this._ggxMaterial=Qs(r,e,t)}return r}_compileMaterial(e){let t=new G(new br,e);this._renderer.compile(t,Bs)}_sceneToCubeUV(e,t,n,r,i){let a=new Zo(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(Vs),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new G(new K,new Zr({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(Vs),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;Zs(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=tc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ec());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;Zs(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Bs)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-Is?n-d+Is:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,Zs(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,Bs),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,Zs(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,Bs)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];Zs(t,3*l*(r>this._lodMax-Is?r-this._lodMax+Is:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,Bs)}};function Ys(e){let t=[],n=[],r=e,i=e-Is+1+Ls;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?qs.set(1,r,n):e===1?qs.set(-n,1,-r):e===2?qs.set(-n,r,1):e===3?qs.set(-1,r,-n):e===4?qs.set(-n,-1,r):qs.set(n,r,-1),qs.toArray(l,(e*6+t)*3)}}let u=new br;u.setAttribute(`position`,new or(c,3)),u.setAttribute(`outputDirection`,new or(l,3)),n.push(new G(u,null)),r>Is&&r--}return{lodMeshes:n,sizeLods:t}}function Xs(e,t,n){let r=new Bt(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function Zs(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function Qs(e,t,n){return new mo({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:zs,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:nc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function $s(e,t,n){return new mo({name:`SphericalGaussianBlur`,defines:{SAMPLES:Rs,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:nc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function ec(){return new mo({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:nc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function tc(){return new mo({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:nc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function nc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var rc=class extends Bt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Ti(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new K(5,5,5),i=new mo({name:`CubemapFromEquirect`,uniforms:ao(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new G(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=h),new rs(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function ic(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new rc(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new Js(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new Js(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function ac(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&ct(`WebGLRenderer: `+e+` extension not supported.`),t}}}function oc(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0||(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++),t}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?cr:sr)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function sc(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function cc(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:R(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function lc(e,t,n){let r=new WeakMap,i=new Rt;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new Vt(h,p,m,u);g.type=w,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new B(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function uc(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var dc={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function fc(e,t,n,r,i,a){let o=new Bt(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new br;l.setAttribute(`position`,new W([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new W([0,2,0,0,2,0],2));let u=new ho({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new G(l,u),f=new Qo(-1,1,1,-1,0,1),p=null,m=null,h=!1,g,_=null,v=[],y=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<v.length;n++){let r=v[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){v=e,y=v.length>0&&v[0].isRenderPass===!0;let t=o.width,n=o.height;v.length>0&&s===null&&(s=new Bt(t,n,{type:T,depthBuffer:!1,stencilBuffer:!1}),c=new Bt(t,n,{type:T,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<v.length;e++){let r=v[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&v.length===0)return!1;if(_=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return y===!1&&e.setRenderTarget(o),g=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return y},this.end=function(e,t){e.toneMapping=g,h=!0;let n=o,r=s;for(let i=0;i<v.length;i++){let a=v[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},Dt.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=dc[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(_),e.render(d,f),_=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var pc=new Lt,mc=new Di(1,1),hc=new Vt,gc=new Ht,_c=new Ti,vc=[],yc=[],bc=new Float32Array(16),xc=new Float32Array(9),Sc=new Float32Array(4);function Cc(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=vc[i];if(a===void 0&&(a=new Float32Array(i),vc[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function wc(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Tc(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Ec(e,t){let n=yc[t];n===void 0&&(n=new Int32Array(t),yc[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Dc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Oc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(wc(n,t))return;e.uniform2fv(this.addr,t),Tc(n,t)}}function kc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(wc(n,t))return;e.uniform3fv(this.addr,t),Tc(n,t)}}function Ac(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(wc(n,t))return;e.uniform4fv(this.addr,t),Tc(n,t)}}function jc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(wc(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Tc(n,t)}else{if(wc(n,r))return;Sc.set(r),e.uniformMatrix2fv(this.addr,!1,Sc),Tc(n,r)}}function Mc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(wc(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Tc(n,t)}else{if(wc(n,r))return;xc.set(r),e.uniformMatrix3fv(this.addr,!1,xc),Tc(n,r)}}function Nc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(wc(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Tc(n,t)}else{if(wc(n,r))return;bc.set(r),e.uniformMatrix4fv(this.addr,!1,bc),Tc(n,r)}}function Pc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Fc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(wc(n,t))return;e.uniform2iv(this.addr,t),Tc(n,t)}}function Ic(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(wc(n,t))return;e.uniform3iv(this.addr,t),Tc(n,t)}}function Lc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(wc(n,t))return;e.uniform4iv(this.addr,t),Tc(n,t)}}function Rc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function zc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(wc(n,t))return;e.uniform2uiv(this.addr,t),Tc(n,t)}}function Bc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(wc(n,t))return;e.uniform3uiv(this.addr,t),Tc(n,t)}}function Vc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(wc(n,t))return;e.uniform4uiv(this.addr,t),Tc(n,t)}}function Hc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(mc.compareFunction=n.isReversedDepthBuffer()?518:515,a=mc):a=pc,n.setTexture2D(t||a,i)}function Uc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||gc,i)}function Wc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||_c,i)}function Gc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||hc,i)}function Kc(e){switch(e){case 5126:return Dc;case 35664:return Oc;case 35665:return kc;case 35666:return Ac;case 35674:return jc;case 35675:return Mc;case 35676:return Nc;case 5124:case 35670:return Pc;case 35667:case 35671:return Fc;case 35668:case 35672:return Ic;case 35669:case 35673:return Lc;case 5125:return Rc;case 36294:return zc;case 36295:return Bc;case 36296:return Vc;case 35678:case 36198:case 36298:case 36306:case 35682:return Hc;case 35679:case 36299:case 36307:return Uc;case 35680:case 36300:case 36308:case 36293:return Wc;case 36289:case 36303:case 36311:case 36292:return Gc}}function qc(e,t){e.uniform1fv(this.addr,t)}function Jc(e,t){let n=Cc(t,this.size,2);e.uniform2fv(this.addr,n)}function Yc(e,t){let n=Cc(t,this.size,3);e.uniform3fv(this.addr,n)}function Xc(e,t){let n=Cc(t,this.size,4);e.uniform4fv(this.addr,n)}function Zc(e,t){let n=Cc(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function Qc(e,t){let n=Cc(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function $c(e,t){let n=Cc(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function el(e,t){e.uniform1iv(this.addr,t)}function tl(e,t){e.uniform2iv(this.addr,t)}function nl(e,t){e.uniform3iv(this.addr,t)}function rl(e,t){e.uniform4iv(this.addr,t)}function il(e,t){e.uniform1uiv(this.addr,t)}function al(e,t){e.uniform2uiv(this.addr,t)}function ol(e,t){e.uniform3uiv(this.addr,t)}function sl(e,t){e.uniform4uiv(this.addr,t)}function cl(e,t,n){let r=this.cache,i=t.length,a=Ec(n,i);wc(r,a)||(e.uniform1iv(this.addr,a),Tc(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?mc:pc;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function ll(e,t,n){let r=this.cache,i=t.length,a=Ec(n,i);wc(r,a)||(e.uniform1iv(this.addr,a),Tc(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||gc,a[e])}function ul(e,t,n){let r=this.cache,i=t.length,a=Ec(n,i);wc(r,a)||(e.uniform1iv(this.addr,a),Tc(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||_c,a[e])}function dl(e,t,n){let r=this.cache,i=t.length,a=Ec(n,i);wc(r,a)||(e.uniform1iv(this.addr,a),Tc(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||hc,a[e])}function fl(e){switch(e){case 5126:return qc;case 35664:return Jc;case 35665:return Yc;case 35666:return Xc;case 35674:return Zc;case 35675:return Qc;case 35676:return $c;case 5124:case 35670:return el;case 35667:case 35671:return tl;case 35668:case 35672:return nl;case 35669:case 35673:return rl;case 5125:return il;case 36294:return al;case 36295:return ol;case 36296:return sl;case 35678:case 36198:case 36298:case 36306:case 35682:return cl;case 35679:case 36299:case 36307:return ll;case 35680:case 36300:case 36308:case 36293:return ul;case 36289:case 36303:case 36311:case 36292:return dl}}var pl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Kc(t.type)}},ml=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=fl(t.type)}},hl=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},gl=/(\w+)(\])?(\[|\.)?/g;function _l(e,t){e.seq.push(t),e.map[t.id]=t}function vl(e,t,n){let r=e.name,i=r.length;for(gl.lastIndex=0;;){let a=gl.exec(r),o=gl.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){_l(n,l===void 0?new pl(s,e,t):new ml(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new hl(s),_l(n,e)),n=e}}}var yl=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);vl(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function bl(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var xl=37297,Sl=0;function Cl(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var wl=new H;function Tl(e){Dt._getMatrix(wl,Dt.workingColorSpace,e);let t=`mat3( ${wl.elements.map(e=>e.toFixed(4))} )`;switch(Dt.getTransfer(e)){case Xe:return[t,`LinearTransferOETF`];case Ze:return[t,`sRGBTransferOETF`];default:return L(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function El(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Cl(e.getShaderSource(t),r)}return i}function Dl(e,t){let n=Tl(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var Ol={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function kl(e,t){let n=Ol[t];return n===void 0?(L(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Al=new V;function jl(){return Dt.getLuminanceCoefficients(Al),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Al.x.toFixed(4)}, ${Al.y.toFixed(4)}, ${Al.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Ml(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Fl).join(`
`)}function Nl(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Pl(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Fl(e){return e!==``}function Il(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ll(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Rl=/^[ \t]*#include +<([\w\d./]+)>/gm;function zl(e){return e.replace(Rl,Vl)}var Bl=new Map;function Vl(e,t){let n=Es[t];if(n===void 0){let e=Bl.get(t);if(e!==void 0)n=Es[e],L(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return zl(n)}var Hl=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ul(e){return e.replace(Hl,Wl)}function Wl(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Gl(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var Kl={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function ql(e){return Kl[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var Jl={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function Yl(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:Jl[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var Xl={302:`ENVMAP_MODE_REFRACTION`};function Zl(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:Xl[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var Ql={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function $l(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:Ql[e.combine]||`ENVMAP_BLENDING_NONE`}function eu(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function tu(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=ql(n),l=Yl(n),u=Zl(n),d=$l(n),f=eu(n),p=Ml(n),m=Nl(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Fl).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Fl).join(`
`),_.length>0&&(_+=`
`)):(g=[Gl(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Fl).join(`
`),_=[Gl(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Es.tonemapping_pars_fragment,n.toneMapping===0?``:kl(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Es.colorspace_pars_fragment,Dl(`linearToOutputTexel`,n.outputColorSpace),jl(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Fl).join(`
`)),o=zl(o),o=Il(o,n),o=Ll(o,n),s=zl(s),s=Il(s,n),s=Ll(s,n),o=Ul(o),s=Ul(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=bl(i,i.VERTEX_SHADER,y),S=bl(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=El(i,x,`vertex`),n=El(i,S,`fragment`);R(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):L(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new yl(i,h),T=Pl(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,xl)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Sl++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var nu=0,ru=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new iu(e),t.set(e,n)),n}},iu=class{constructor(e){this.id=nu++,this.code=e,this.usedTimes=0}};function au(e){return e===1030||e===37490||e===36285}function ou(e,t,n,r,i,a){let o=new en,s=new ru,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&L(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,ee,O,k;if(C){let e=Ds[C];D=e.vertexShader,ee=e.fragmentShader}else{D=i.vertexShader,ee=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),O=e.id,k=t.id}let A=e.getRenderTarget(),te=e.state.buffers.depth.getReversed(),j=h.isInstancedMesh===!0,ne=h.isBatchedMesh===!0,M=!!i.map,re=!!i.matcap,ie=!!x,ae=!!i.aoMap,oe=!!i.lightMap,se=!!i.bumpMap&&i.wireframe===!1,ce=!!i.normalMap,le=!!i.displacementMap,ue=!!i.emissiveMap,N=!!i.metalnessMap,de=!!i.roughnessMap,fe=i.anisotropy>0,pe=i.clearcoat>0,me=i.dispersion>0,he=i.retroreflectivity>0,ge=i.iridescence>0,_e=i.sheen>0,ve=i.transmission>0,ye=fe&&!!i.anisotropyMap,be=pe&&!!i.clearcoatMap,xe=pe&&!!i.clearcoatNormalMap,Se=pe&&!!i.clearcoatRoughnessMap,Ce=ge&&!!i.iridescenceMap,we=ge&&!!i.iridescenceThicknessMap,Te=_e&&!!i.sheenColorMap,Ee=_e&&!!i.sheenRoughnessMap,De=!!i.specularMap,Oe=!!i.specularColorMap,ke=!!i.specularIntensityMap,Ae=ve&&!!i.transmissionMap,je=ve&&!!i.thicknessMap,Me=!!i.gradientMap,Ne=!!i.alphaMap,Pe=i.alphaTest>0,P=!!i.alphaHash,Fe=!!i.extensions,Ie=0;i.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Ie=e.toneMapping);let Le={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:ee,defines:i.defines,customVertexShaderID:O,customFragmentShaderID:k,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:ne,batchingColor:ne&&h._colorsTexture!==null,instancing:j,instancingColor:j&&h.instanceColor!==null,instancingMorph:j&&h.morphTexture!==null,outputColorSpace:A===null?e.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Dt.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:M,matcap:re,envMap:ie,envMapMode:ie&&x.mapping,envMapCubeUVHeight:S,aoMap:ae,lightMap:oe,bumpMap:se,normalMap:ce,displacementMap:le,emissiveMap:ue,normalMapObjectSpace:ce&&i.normalMapType===1,normalMapTangentSpace:ce&&i.normalMapType===0,packedNormalMap:ce&&i.normalMapType===0&&au(i.normalMap.format),metalnessMap:N,roughnessMap:de,anisotropy:fe,anisotropyMap:ye,clearcoat:pe,clearcoatMap:be,clearcoatNormalMap:xe,clearcoatRoughnessMap:Se,dispersion:me,retroreflection:he,iridescence:ge,iridescenceMap:Ce,iridescenceThicknessMap:we,sheen:_e,sheenColorMap:Te,sheenRoughnessMap:Ee,specularMap:De,specularColorMap:Oe,specularIntensityMap:ke,transmission:ve,transmissionMap:Ae,thicknessMap:je,gradientMap:Me,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Ne,alphaTest:Pe,alphaHash:P,combine:i.combine,mapUv:M&&m(i.map.channel),aoMapUv:ae&&m(i.aoMap.channel),lightMapUv:oe&&m(i.lightMap.channel),bumpMapUv:se&&m(i.bumpMap.channel),normalMapUv:ce&&m(i.normalMap.channel),displacementMapUv:le&&m(i.displacementMap.channel),emissiveMapUv:ue&&m(i.emissiveMap.channel),metalnessMapUv:N&&m(i.metalnessMap.channel),roughnessMapUv:de&&m(i.roughnessMap.channel),anisotropyMapUv:ye&&m(i.anisotropyMap.channel),clearcoatMapUv:be&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:xe&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Se&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:Ce&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:we&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:Te&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Ee&&m(i.sheenRoughnessMap.channel),specularMapUv:De&&m(i.specularMap.channel),specularColorMapUv:Oe&&m(i.specularColorMap.channel),specularIntensityMapUv:ke&&m(i.specularIntensityMap.channel),transmissionMapUv:Ae&&m(i.transmissionMap.channel),thicknessMapUv:je&&m(i.thicknessMap.channel),alphaMapUv:Ne&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(ce||fe),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(M||Ne),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&ce===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:te,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ie,decodeVideoTexture:M&&i.map.isVideoTexture===!0&&Dt.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:ue&&i.emissiveMap.isVideoTexture===!0&&Dt.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Fe&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Fe&&i.extensions.multiDraw===!0||ne)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Le.vertexUv1s=c.has(1),Le.vertexUv2s=c.has(2),Le.vertexUv3s=c.has(3),c.clear(),Le}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=Ds[t];n=uo.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new tu(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function su(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function cu(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function lu(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function uu(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||cu),r.length>1&&r.sort(t||lu),i.length>1&&i.sort(t||lu)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function du(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new uu,e.set(t,[i])):n>=r.length?(i=new uu,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function fu(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new V,color:new U};break;case`SpotLight`:n={position:new V,direction:new V,color:new U,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new V,color:new U,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new V,skyColor:new U,groundColor:new U};break;case`RectAreaLight`:n={color:new U,position:new V,halfWidth:new V,halfHeight:new V}}return e[t.id]=n,n}}}function pu(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new B};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new B};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new B,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var mu=0;function hu(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function gu(e){let t=new fu,n=pu(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new V);let i=new V,a=new Ut,o=new Ut;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(hu);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=q.LTC_FLOAT_1,r.rectAreaLTC2=q.LTC_FLOAT_2):(r.rectAreaLTC1=q.LTC_HALF_1,r.rectAreaLTC2=q.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=mu++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function _u(e){let t=new gu(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function vu(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new _u(e),t.set(n,[a])):r>=i.length?(a=new _u(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var yu=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,bu=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,xu=[new V(1,0,0),new V(-1,0,0),new V(0,1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1)],Su=[new V(0,-1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1),new V(0,-1,0),new V(0,-1,0)],Cu=new Ut,wu=new V,Tu=new V;function Eu(e,t,n){let r=new wi,i=new B,a=new B,o=new Rt,s=new _o,c=new vo,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},p=new mo({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new B},radius:{value:4}},vertexShader:yu,fragmentShader:bu}),m=p.clone();m.defines.HORIZONTAL_PASS=1;let g=new br;g.setAttribute(`position`,new or(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new G(g,p),v=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let y=this.type;this.render=function(t,n,s){if(v.enabled===!1||v.autoUpdate===!1&&v.needsUpdate===!1||t.length===0)return;this.type===2&&(L(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),p=e.state;p.setBlending(0),p.buffers.depth.getReversed()===!0?p.buffers.color.setClear(0,0,0,0):p.buffers.color.setClear(1,1,1,1),p.buffers.depth.setTest(!0),p.setScissorTest(!1);let m=y!==this.type;m&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){L(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let g=d.getFrameExtents();i.multiply(g),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/g.x),i.x=a.x*g.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/g.y),i.y=a.y*g.y,d.mapSize.y=a.y));let _=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=_,d.map===null||m===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){L(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new Bt(i.x,i.y,{format:ae,type:T,minFilter:h,magFilter:h,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new Di(i.x,i.y,w),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=ne,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=f,d.map.depthTexture.magFilter=f}else l.isPointLight?(d.map=new rc(i.x),d.map.depthTexture=new Oi(i.x,C)):(d.map=new Bt(i.x,i.y),d.map.depthTexture=new Di(i.x,i.y,C)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=ne,this.type===1?(d.map.depthTexture.compareFunction=_?518:515,d.map.depthTexture.minFilter=h,d.map.depthTexture.magFilter=h):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=f,d.map.depthTexture.magFilter=f);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let v=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);for(let t=0;t<v;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),wu.setFromMatrixPosition(l.matrixWorld),e.position.copy(wu),Tu.copy(e.position),Tu.add(xu[t]),e.up.copy(Su[t]),e.lookAt(Tu),e.updateMatrixWorld(),n.makeTranslation(-wu.x,-wu.y,-wu.z),Cu.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(Cu,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),p.viewport(o)}r=d.getFrustum(t),S(n,s,i,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&b(d,s),d.needsUpdate=!1}y=this.type,v.needsUpdate=!1,e.setRenderTarget(c,l,d)};function b(n,r){let a=t.update(_);p.defines.VSM_SAMPLES!==n.blurSamples&&(p.defines.VSM_SAMPLES=n.blurSamples,m.defines.VSM_SAMPLES=n.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),n.mapPass===null?n.mapPass=new Bt(i.x,i.y,{format:ae,type:T}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),p.uniforms.shadow_pass.value=n.map.depthTexture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,p,_,null),m.uniforms.shadow_pass.value=n.mapPass.texture,m.uniforms.resolution.value.set(n.map.width,n.map.height),m.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,m,_,null)}function x(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,E)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function S(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=x(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=x(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)S(c[e],i,a,o,s)}function E(e){e.target.removeEventListener(`dispose`,E);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Du(e,t){function n(){let t=!1,n=new Rt,r=null,i=new Rt(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?N(e.DEPTH_TEST):de(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=ut[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?N(e.STENCIL_TEST):de(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new U(0,0,0),T=0,E=!1,D=null,ee=null,O=null,k=null,A=null,te=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),j=!1,ne=0,M=e.getParameter(e.VERSION);M.indexOf(`WebGL`)===-1?M.indexOf(`OpenGL ES`)!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(M)[1]),j=ne>=2):(ne=parseFloat(/^WebGL (\d)/.exec(M)[1]),j=ne>=1);let re=null,ie={},ae=e.getParameter(e.SCISSOR_BOX),oe=e.getParameter(e.VIEWPORT),se=new Rt().fromArray(ae),ce=new Rt().fromArray(oe);function le(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let ue={};ue[e.TEXTURE_2D]=le(e.TEXTURE_2D,e.TEXTURE_2D,1),ue[e.TEXTURE_CUBE_MAP]=le(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),ue[e.TEXTURE_2D_ARRAY]=le(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),ue[e.TEXTURE_3D]=le(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),N(e.DEPTH_TEST),o.setFunc(3),ye(!1),be(1),N(e.CULL_FACE),_e(0);function N(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function de(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function fe(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function pe(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function me(t){return h!==t&&(e.useProgram(t),h=t,!0)}let he={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};he[103]=e.MIN,he[104]=e.MAX;let ge={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function _e(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(de(e.BLEND),g=!1);else if(g===!1&&(N(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:R(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:R(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:R(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:R(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a=a||n,o=o||r,s=s||i,(n!==v||a!==x)&&(e.blendEquationSeparate(he[n],he[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(ge[r],ge[i],ge[o],ge[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function ve(t,n){t.side===2?de(e.CULL_FACE):N(e.CULL_FACE);let r=t.side===1;n&&(r=!r),ye(r),t.blending===1&&t.transparent===!1?_e(0):_e(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),Se(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?N(e.SAMPLE_ALPHA_TO_COVERAGE):de(e.SAMPLE_ALPHA_TO_COVERAGE)}function ye(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function be(t){t===0?de(e.CULL_FACE):(N(e.CULL_FACE),t!==ee&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),ee=t}function xe(t){t!==O&&(j&&e.lineWidth(t),O=t)}function Se(t,n,r){t?(N(e.POLYGON_OFFSET_FILL),(k!==n||A!==r)&&(k=n,A=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):de(e.POLYGON_OFFSET_FILL)}function Ce(t){t?N(e.SCISSOR_TEST):de(e.SCISSOR_TEST)}function we(t){t===void 0&&(t=e.TEXTURE0+te-1),re!==t&&(e.activeTexture(t),re=t)}function Te(t,n,r){r===void 0&&(r=re===null?e.TEXTURE0+te-1:re);let i=ie[r];i===void 0&&(i={type:void 0,texture:void 0},ie[r]=i),(i.type!==t||i.texture!==n)&&(re!==r&&(e.activeTexture(r),re=r),e.bindTexture(t,n||ue[t]),i.type=t,i.texture=n)}function Ee(){let t=ie[re];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function De(){try{e.compressedTexImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Oe(){try{e.compressedTexImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function ke(){try{e.texSubImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Ae(){try{e.texSubImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function je(){try{e.compressedTexSubImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Me(){try{e.compressedTexSubImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Ne(){try{e.texStorage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Pe(){try{e.texStorage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function P(){try{e.texImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Fe(){try{e.texImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Ie(t){return d[t]===void 0?e.getParameter(t):d[t]}function Le(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function F(t){se.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),se.copy(t))}function Re(t){ce.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),ce.copy(t))}function I(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function ze(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Be(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},re=null,ie={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new U(0,0,0),T=0,E=!1,D=null,ee=null,O=null,k=null,A=null,se.set(0,0,e.canvas.width,e.canvas.height),ce.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:N,disable:de,bindFramebuffer:fe,drawBuffers:pe,useProgram:me,setBlending:_e,setMaterial:ve,setFlipSided:ye,setCullFace:be,setLineWidth:xe,setPolygonOffset:Se,setScissorTest:Ce,activeTexture:we,bindTexture:Te,unbindTexture:Ee,compressedTexImage2D:De,compressedTexImage3D:Oe,texImage2D:P,texImage3D:Fe,pixelStorei:Le,getParameter:Ie,updateUBOMapping:I,uniformBlockBinding:ze,texStorage2D:Ne,texStorage3D:Pe,texSubImage2D:ke,texSubImage3D:Ae,compressedTexSubImage2D:je,compressedTexSubImage3D:Me,scissor:F,viewport:Re,reset:Be}}function Ou(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),v=new B,y=new WeakMap,b=new Set,x,S=new WeakMap,C=!1;try{C=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function w(e,t){return C?new OffscreenCanvas(e,t):rt(`canvas`)}function T(e,t,n){let r=1,i=Ie(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);x===void 0&&(x=w(n,a));let o=t?w(n,a):x;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),L(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&L(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function E(e){return e.generateMipmaps}function D(t){e.generateMipmap(t)}function ee(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function O(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];L(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||L(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?Xe:Dt.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function k(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,L(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function A(e,t){return E(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function te(e){let t=e.target;t.removeEventListener(`dispose`,te),ne(t),t.isVideoTexture&&y.delete(t),t.isHTMLTexture&&b.delete(t)}function j(e){let t=e.target;t.removeEventListener(`dispose`,j),ie(t)}function ne(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=S.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&re(e),Object.keys(i).length===0&&S.delete(n)}r.remove(e)}function re(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=S.get(i);delete a[n.__cacheKey],o.memory.textures--}function ie(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let ae=0;function oe(){ae=0}function se(){return ae}function ce(e){ae=e}function le(){let e=ae;return e>=i.maxTextures&&L(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),ae+=1,e}function ue(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function N(t,i){let a=r.get(t);if(t.isVideoTexture&&P(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)L(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)L(`WebGLRenderer: Texture marked for update but image is incomplete`);else{xe(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function de(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?xe(a,t,i):(t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i))}function fe(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?xe(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function pe(t,i){let a=r.get(t);t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version?Se(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let me={[l]:e.REPEAT,[u]:e.CLAMP_TO_EDGE,[d]:e.MIRRORED_REPEAT},he={[f]:e.NEAREST,[p]:e.NEAREST_MIPMAP_NEAREST,[m]:e.NEAREST_MIPMAP_LINEAR,[h]:e.LINEAR,[g]:e.LINEAR_MIPMAP_NEAREST,[_]:e.LINEAR_MIPMAP_LINEAR},ge={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function _e(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&L(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,me[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,me[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,me[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,he[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,he[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,ge[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function ve(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,te));let i=n.source,a=S.get(i);a===void 0&&(a={},S.set(i,a));let s=ue(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&re(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function ye(e,t,n){return Math.floor(Math.floor(e/n)/t)}function be(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=ye(n.start,r.width,4),c=ye(t.start,r.width,4);n.start<=i+1&&a===c&&ye(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function xe(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=ve(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let d=r.get(u);if(u.version!==d.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=Dt.getPrimaries(Dt.workingColorSpace),r=o.colorSpace===``?null:Dt.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=T(o.image,!1,i.maxTextureSize);t=Fe(o,t);let r=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=O(o.internalFormat,r,f,o.normalized,o.colorSpace,o.isVideoTexture);_e(c,o);let m,h=o.mipmaps,g=o.isVideoTexture!==!0,_=d.__version===void 0||l===!0,v=u.dataReady,y=A(o,t);if(o.isDepthTexture)p=k(o.format===M,o.type),_&&(g?n.texStorage2D(e.TEXTURE_2D,1,p,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,p,t.width,t.height,0,r,f,null));else if(o.isDataTexture){if(h.length>0){g&&_&&n.texStorage2D(e.TEXTURE_2D,y,p,h[0].width,h[0].height);for(let t=0,i=h.length;t<i;t++)m=h[t],g?v&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,m.width,m.height,r,f,m.data):n.texImage2D(e.TEXTURE_2D,t,p,m.width,m.height,0,r,f,m.data);o.generateMipmaps=!1}else g?(_&&n.texStorage2D(e.TEXTURE_2D,y,p,t.width,t.height),v&&be(o,t,r,f)):n.texImage2D(e.TEXTURE_2D,0,p,t.width,t.height,0,r,f,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){g&&_&&n.texStorage3D(e.TEXTURE_2D_ARRAY,y,p,h[0].width,h[0].height,t.depth);for(let i=0,a=h.length;i<a;i++)if(m=h[i],o.format!==1023){if(r!==null){if(g){if(v){if(o.layerUpdates.size>0){let t=Ss(m.width,m.height,o.format,o.type);for(let a of o.layerUpdates){let o=m.data.subarray(a*t/m.data.BYTES_PER_ELEMENT,(a+1)*t/m.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,m.width,m.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,m.width,m.height,t.depth,r,m.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,p,m.width,m.height,t.depth,0,m.data,0,0)}else L(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else g?v&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,m.width,m.height,t.depth,r,f,m.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,p,m.width,m.height,t.depth,0,r,f,m.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{g&&_&&n.texStorage2D(e.TEXTURE_2D,y,p,h[0].width,h[0].height);for(let t=0,i=h.length;t<i;t++)m=h[t],o.format===1023?g?v&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,m.width,m.height,r,f,m.data):n.texImage2D(e.TEXTURE_2D,t,p,m.width,m.height,0,r,f,m.data):r===null?L(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):g?v&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,m.width,m.height,r,m.data):n.compressedTexImage2D(e.TEXTURE_2D,t,p,m.width,m.height,0,m.data)}}else if(o.isDataArrayTexture){if(g){if(_&&n.texStorage3D(e.TEXTURE_2D_ARRAY,y,p,t.width,t.height,t.depth),v){if(o.layerUpdates.size>0){let i=Ss(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,f,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,f,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,p,t.width,t.height,t.depth,0,r,f,t.data)}else if(o.isData3DTexture)g?(_&&n.texStorage3D(e.TEXTURE_3D,y,p,t.width,t.height,t.depth),v&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,f,t.data)):n.texImage3D(e.TEXTURE_3D,0,p,t.width,t.height,t.depth,0,r,f,t.data);else if(o.isFramebufferTexture){if(_){if(g)n.texStorage2D(e.TEXTURE_2D,y,p,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<y;t++)n.texImage2D(e.TEXTURE_2D,t,p,i,a,0,r,f,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),b.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of b)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(h.length>0){if(g&&_){let t=Ie(h[0]);n.texStorage2D(e.TEXTURE_2D,y,p,t.width,t.height)}for(let t=0,i=h.length;t<i;t++)m=h[t],g?v&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,f,m):n.texImage2D(e.TEXTURE_2D,t,p,r,f,m);o.generateMipmaps=!1}else if(g){if(_){let r=Ie(t);n.texStorage2D(e.TEXTURE_2D,y,p,r.width,r.height)}v&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,f,t)}else n.texImage2D(e.TEXTURE_2D,0,p,r,f,t);E(o)&&D(c),d.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function Se(t,o,s){if(o.image.length!==6)return;let c=ve(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=Dt.getPrimaries(Dt.workingColorSpace),r=o.colorSpace===``?null:Dt.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=T(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Fe(o,m[e]);let h=m[0],g=a.convert(o.format,o.colorSpace),_=a.convert(o.type),v=O(o.internalFormat,g,_,o.normalized,o.colorSpace),y=o.isVideoTexture!==!0,b=u.__version===void 0||c===!0,x=l.dataReady,S=A(o,h);_e(e.TEXTURE_CUBE_MAP,o);let C;if(f){y&&b&&n.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,h.width,h.height);for(let t=0;t<6;t++){C=m[t].mipmaps;for(let r=0;r<C.length;r++){let i=C[r];o.format===1023?y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,i.width,i.height,0,g,_,i.data):g===null?L(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):y?x&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,i.width,i.height,0,i.data)}}}else{if(C=o.mipmaps,y&&b){C.length>0&&S++;let t=Ie(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,t.width,t.height)}for(let t=0;t<6;t++)if(p){y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,g,_,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,m[t].width,m[t].height,0,g,_,m[t].data);for(let r=0;r<C.length;r++){let i=C[r].image[t].image;y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,v,i.width,i.height,0,g,_,i.data)}}else{y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,g,_,m[t]);for(let r=0;r<C.length;r++){let i=C[r];y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,g,_,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,v,g,_,i.image[t])}}}E(o)&&D(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function Ce(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=O(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),Pe(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,Ne(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function we(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=k(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;Pe(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ne(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ne(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=O(o.internalFormat,c,l,o.normalized,o.colorSpace);Pe(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ne(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ne(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Te(t,i,o){let c=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,l.__webglTexture&&i.depthTexture.image.width===i.width&&i.depthTexture.image.height===i.height||(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),c){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,te)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),_e(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else N(i.depthTexture,0);let u=l.__webglTexture,d=Ne(i),f=c?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)Pe(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)Pe(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function Ee(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)Te(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?Te(i.__webglFramebuffer[0],t,0):Te(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),we(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),we(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function De(t,n,i){let a=r.get(t);n!==void 0&&Ce(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&Ee(t)}function Oe(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,j);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&Pe(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=O(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=Ne(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),we(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),_e(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)Ce(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else Ce(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);E(i)&&D(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),_e(c,a),Ce(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),E(a)&&D(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),_e(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)Ce(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else Ce(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);E(i)&&D(r),n.unbindTexture()}t.depthBuffer&&Ee(t)}function ke(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(E(a)){let t=ee(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),D(t),n.unbindTexture()}}}let Ae=[],je=[];function Me(t){if(t.samples>0){if(Pe(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(Ae.length=0,je.length=0,Ae.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&(Ae.push(l),je.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,je)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Ae))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function Ne(e){return Math.min(i.maxSamples,e.samples)}function Pe(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function P(e){let t=o.render.frame;y.get(e)!==t&&(y.set(e,t),e.update())}function Fe(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Dt.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&L(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):R(`WebGLTextures: Unsupported texture color space:`,n)),t}function Ie(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(v.width=e.naturalWidth||e.width,v.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(v.width=e.displayWidth,v.height=e.displayHeight):(v.width=e.width,v.height=e.height),v}this.allocateTextureUnit=le,this.resetTextureUnits=oe,this.getTextureUnits=se,this.setTextureUnits=ce,this.setTexture2D=N,this.setTexture2DArray=de,this.setTexture3D=fe,this.setTextureCube=pe,this.rebindTextures=De,this.setupRenderTarget=Oe,this.updateRenderTargetMipmap=ke,this.updateMultisampleRenderTarget=Me,this.setupDepthRenderbuffer=Ee,this.setupFrameBufferTexture=Ce,this.useMultisampledRTT=Pe,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function ku(e,t){function n(n,r=``){let i,a=Dt.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Au=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ju=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Mu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new ki(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new mo({vertexShader:Au,fragmentShader:ju,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new G(new Qa(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Nu=class extends dt{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new Mu,g={},_=t.getContextAttributes(),y=null,b=null,x=[],S=[],w=new B,T=null,E=null,D=new Zo;D.viewport=new Rt;let O=new Zo;O.viewport=new Rt;let k=[D,O],A=new is,te=null,re=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=x[e];return t===void 0&&(t=new bn,x[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=x[e];return t===void 0&&(t=new bn,x[e]=t),t.getGripSpace()},this.getHand=function(e){let t=x[e];return t===void 0&&(t=new bn,x[e]=t),t.getHandSpace()};function ie(e){let t=S.indexOf(e.inputSource);if(t===-1)return;let n=x[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ae(){r.removeEventListener(`select`,ie),r.removeEventListener(`selectstart`,ie),r.removeEventListener(`selectend`,ie),r.removeEventListener(`squeeze`,ie),r.removeEventListener(`squeezestart`,ie),r.removeEventListener(`squeezeend`,ie),r.removeEventListener(`end`,ae),r.removeEventListener(`inputsourceschange`,oe);for(let e=0;e<x.length;e++){let t=S[e];t!==null&&(S[e]=null,x[e].disconnect(t))}te=null,re=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(y),f=null,d=null,u=null,r=null,b=null,pe.stop(),n.isPresenting=!1,e.setPixelRatio(T),e.setSize(w.width,w.height,!1),E!==null){let e=E.camera;e.fov=E.fov,e.zoom=E.zoom,e.updateProjectionMatrix(),E=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&L(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&L(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(y=e.getRenderTarget(),r.addEventListener(`select`,ie),r.addEventListener(`selectstart`,ie),r.addEventListener(`selectend`,ie),r.addEventListener(`squeeze`,ie),r.addEventListener(`squeezestart`,ie),r.addEventListener(`squeezeend`,ie),r.addEventListener(`end`,ae),r.addEventListener(`inputsourceschange`,oe),_.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(w),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?M:ne,a=_.stencil?ee:C);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),b=new Bt(d.textureWidth,d.textureHeight,{format:j,type:v,depthTexture:new Di(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),b=new Bt(f.framebufferWidth,f.framebufferHeight,{format:j,type:v,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),pe.setContext(r),pe.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function oe(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=S.indexOf(n);r>=0&&(S[r]=null,x[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=S.indexOf(n);if(r===-1){for(let e=0;e<x.length;e++)if(e>=S.length){S.push(n),r=e;break}else if(S[e]===null){S[e]=n,r=e;break}if(r===-1)break}let i=x[r];i&&i.connect(n)}}let se=new V,ce=new V;function le(e,t,n){se.setFromMatrixPosition(t.matrixWorld),ce.setFromMatrixPosition(n.matrixWorld);let r=se.distanceTo(ce),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function ue(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),A.near=O.near=D.near=t,A.far=O.far=D.far=n,(te!==A.near||re!==A.far)&&(r.updateRenderState({depthNear:A.near,depthFar:A.far}),te=A.near,re=A.far),A.layers.mask=e.layers.mask|6,D.layers.mask=A.layers.mask&-5,O.layers.mask=A.layers.mask&-3;let i=e.parent,a=A.cameras;ue(A,i);for(let e=0;e<a.length;e++)ue(a[e],i);a.length===2?le(A,D,O):A.projectionMatrix.copy(D.projectionMatrix),E===null&&e.isPerspectiveCamera&&(E={camera:e,fov:e.fov,zoom:e.zoom}),N(e,A,i)};function N(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=mt*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return A},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(A)},this.getCameraTexture=function(e){return g[e]};let de=null;function fe(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(b,f.framebuffer),e.setRenderTarget(b));let i=!1;t.length!==A.cameras.length&&(A.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(b,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(b))}let o=k[n];o===void 0&&(o=new Zo,o.layers.enable(n),o.viewport=new Rt,k[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(A.matrix.copy(o.matrix),A.matrix.decompose(A.position,A.quaternion,A.scale)),i===!0&&A.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new ki,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<x.length;e++){let t=S[e],n=x[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}de&&de(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let pe=new ws;pe.setAnimationLoop(fe),this.setAnimationLoop=function(e){de=e},this.dispose=function(){}}},Pu=new Ut,Fu=new H;Fu.set(-1,0,0,0,1,0,0,0,1);function Iu(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,lo(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Pu.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Fu),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Lu(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return R(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?L(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):L(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var Ru=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),zu=null;function Bu(){return zu===null&&(zu=new di(Ru,16,16,ae,T),zu.name=`DFG_LUT`,zu.minFilter=h,zu.magFilter=h,zu.wrapS=u,zu.wrapT=u,zu.generateMipmaps=!1,zu.needsUpdate=!0),zu}var Vu=class{constructor(e={}){let{canvas:t=it(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=v}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([se,oe,ie]),g=new Set([v,C,x,ee,E,D]),y=new Uint32Array(4),b=new Int32Array(4),S=new V,w=null,O=null,k=[],A=[],te=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let j=this,ne=!1,M=null,re=null,ae=null,ce=null;this._outputColorSpace=Je;let le=0,ue=0,N=null,de=-1,fe=null,pe=new Rt,me=new Rt,he=null,ge=new U(0),_e=0,ve=t.width,ye=t.height,be=1,xe=null,Se=null,Ce=new Rt(0,0,ve,ye),we=new Rt(0,0,ve,ye),Te=!1,Ee=new wi,De=!1,Oe=!1,ke=new Ut,Ae=new V,je=new Rt,Me={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ne=!1;function Pe(){return N===null?be:1}let P=n;function Fe(e,n){return t.getContext(e,n)}let Ie,Le,F,Re,I,ze,Be,Ve,He,Ue,We,Ge,Ke,qe,Ye,Xe,Ze,Qe,$e,tt,nt,rt,at;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r186`),t.addEventListener(`webglcontextlost`,ut,!1),t.addEventListener(`webglcontextrestored`,dt,!1),t.addEventListener(`webglcontextcreationerror`,ft,!1),P===null){let t=`webgl2`;if(P=Fe(t,e),P===null)throw Fe(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}st()}catch(e){throw t.removeEventListener(`webglcontextlost`,ut,!1),t.removeEventListener(`webglcontextrestored`,dt,!1),t.removeEventListener(`webglcontextcreationerror`,ft,!1),R(`WebGLRenderer: `+e.message),e}function st(){Ie=new ac(P),Ie.init(),nt=new ku(P,Ie),Le=new Ps(P,Ie,e,nt),F=new Du(P,Ie),Le.reversedDepthBuffer&&d&&F.buffers.depth.setReversed(!0),re=P.createFramebuffer(),ae=P.createFramebuffer(),ce=P.createFramebuffer(),Re=new cc(P),I=new su,ze=new Ou(P,Ie,F,I,Le,nt,Re),Be=new ic(j),Ve=new Ts(P),rt=new Ms(P,Ve),He=new oc(P,Ve,Re,rt),Ue=new uc(P,He,Ve,rt,Re),Qe=new lc(P,Le,ze),Ye=new Fs(I),We=new ou(j,Be,Ie,Le,rt,Ye),Ge=new Iu(j,I),Ke=new du,qe=new vu(Ie),Ze=new js(j,Be,F,Ue,p,s),Xe=new Eu(j,Ue,Le),at=new Lu(P,Re,Le,F),$e=new Ns(P,Ie,Re),tt=new sc(P,Ie,Re),Re.programs=We.programs,j.capabilities=Le,j.extensions=Ie,j.properties=I,j.renderLists=Ke,j.shadowMap=Xe,j.state=F,j.info=Re}m!==1009&&(te=new fc(m,t.width,t.height,o,r,i));let ct=new Nu(j,P);this.xr=ct,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){let e=Ie.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Ie.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return be},this.setPixelRatio=function(e){e!==void 0&&(be=e,this.setSize(ve,ye,!1))},this.getSize=function(e){return e.set(ve,ye)},this.setSize=function(e,n,r=!0){ct.isPresenting?L(`WebGLRenderer: Can't change size while VR device is presenting.`):(ve=e,ye=n,t.width=Math.floor(e*be),t.height=Math.floor(n*be),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),te!==null&&te.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(ve*be,ye*be).floor()},this.setDrawingBufferSize=function(e,n,r){ve=e,ye=n,be=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009)R(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){L(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}te.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(pe)},this.getViewport=function(e){return e.copy(Ce)},this.setViewport=function(e,t,n,r){e.isVector4?Ce.set(e.x,e.y,e.z,e.w):Ce.set(e,t,n,r),F.viewport(pe.copy(Ce).multiplyScalar(be).round())},this.getScissor=function(e){return e.copy(we)},this.setScissor=function(e,t,n,r){e.isVector4?we.set(e.x,e.y,e.z,e.w):we.set(e,t,n,r),F.scissor(me.copy(we).multiplyScalar(be).round())},this.getScissorTest=function(){return Te},this.setScissorTest=function(e){F.setScissorTest(Te=e)},this.setOpaqueSort=function(e){xe=e},this.setTransparentSort=function(e){Se=e},this.getClearColor=function(e){return e.copy(Ze.getClearColor())},this.setClearColor=function(){Ze.setClearColor(...arguments)},this.getClearAlpha=function(){return Ze.getClearAlpha()},this.setClearAlpha=function(){Ze.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(N!==null){let t=N.texture.format;e=h.has(t)}if(e){let e=N.texture.type,t=g.has(e),n=Ze.getClearColor(),r=Ze.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(y[0]=i,y[1]=a,y[2]=o,y[3]=r,P.clearBufferuiv(P.COLOR,0,y)):(b[0]=i,b[1]=a,b[2]=o,b[3]=r,P.clearBufferiv(P.COLOR,0,b))}else r|=P.COLOR_BUFFER_BIT}t&&(r|=P.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&P.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),M=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,ut,!1),t.removeEventListener(`webglcontextrestored`,dt,!1),t.removeEventListener(`webglcontextcreationerror`,ft,!1),Ze.dispose(),Ke.dispose(),qe.dispose(),I.dispose(),Be.dispose(),Ue.dispose(),rt.dispose(),at.dispose(),We.dispose(),ct.dispose(),ct.removeEventListener(`sessionstart`,vt),ct.removeEventListener(`sessionend`,yt),B.stop()};function ut(e){e.preventDefault(),ot(`WebGLRenderer: Context Lost.`),ne=!0}function dt(){ot(`WebGLRenderer: Context Restored.`),ne=!1;let e=Re.autoReset,t=Xe.enabled,n=Xe.autoUpdate,r=Xe.needsUpdate,i=Xe.type;st(),Re.autoReset=e,Xe.enabled=t,Xe.autoUpdate=n,Xe.needsUpdate=r,Xe.type=i}function ft(e){R(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function pt(e){let t=e.target;t.removeEventListener(`dispose`,pt),mt(t)}function mt(e){ht(e),I.remove(e)}function ht(e){let t=I.get(e).programs;t!==void 0&&(t.forEach(function(e){We.releaseProgram(e)}),e.isShaderMaterial&&We.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=Me);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=kt(e,t,n,r,i);F.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=He.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;rt.setup(i,r,s,n,c);let h,g=$e;if(c!==null&&(h=Ve.get(c),g=tt,g.setIndex(h)),i.isMesh)r.wireframe===!0?(F.setLineWidth(r.wireframeLinewidth*Pe()),g.setMode(P.LINES)):g.setMode(P.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),F.setLineWidth(e*Pe()),i.isLineSegments?g.setMode(P.LINES):i.isLineLoop?g.setMode(P.LINE_LOOP):g.setMode(P.LINE_STRIP)}else i.isPoints?g.setMode(P.POINTS):i.isSprite&&g.setMode(P.TRIANGLES);if(i.isBatchedMesh){if(Ie.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Ve.get(c).bytesPerElement:1,o=I.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(P,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function z(e,t,n,r){M!==null&&e.isNodeMaterial&&M.setObject(r,e),De===!0&&Ye.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,wt(e,t,r),e.side=0,e.needsUpdate=!0,wt(e,t,r),e.side=2):wt(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),M!==null&&M.renderStart(e,t,n),O=qe.get(n),O.init(t),A.push(O),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(O.pushLight(e),e.castShadow&&O.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(O.pushLight(e),e.castShadow&&O.pushShadow(e))}),O.setupLights(),M!==null&&M.updateLights(O.state.lightsArray),Oe=this.localClippingEnabled,De=Ye.init(this.clippingPlanes,Oe),De===!0&&Ye.setGlobalState(this.clippingPlanes,t),M!==null&&Xe.render(O.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];z(o,n,t,e),r.add(o)}else z(i,n,t,e),r.add(i)}}),O=A.pop(),M!==null&&M.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=I.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}Ie.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let gt=null;function _t(e){gt&&gt(e)}function vt(){B.stop()}function yt(){B.start()}let B=new ws;B.setAnimationLoop(_t),typeof self<`u`&&B.setContext(self),this.setAnimationLoop=function(e){gt=e,ct.setAnimationLoop(e),e===null?B.stop():B.start()},ct.addEventListener(`sessionstart`,vt),ct.addEventListener(`sessionend`,yt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){R(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(ne===!0)return;M!==null&&M.renderStart(e,t);let n=ct.enabled===!0&&ct.isPresenting===!0,r=te!==null&&(N===null||n)&&te.begin(j,N);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),ct.enabled===!0&&ct.isPresenting===!0&&(te===null||te.isCompositing()===!1)&&(ct.cameraAutoUpdate===!0&&ct.updateCamera(t),t=ct.getCamera()),e.isScene===!0&&e.onBeforeRender(j,e,t,N),O=qe.get(e,A.length),O.init(t),O.state.textureUnits=ze.getTextureUnits(),A.push(O),ke.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),Ee.setFromProjectionMatrix(ke,et,t.reversedDepth),Oe=this.localClippingEnabled,De=Ye.init(this.clippingPlanes,Oe),w=Ke.get(e,k.length),w.init(),k.push(w),ct.enabled===!0&&ct.isPresenting===!0){let e=j.xr.getDepthSensingMesh();e!==null&&bt(e,t,-1/0,j.sortObjects)}bt(e,t,0,j.sortObjects),w.finish(),M!==null&&M.updateLights(O.state.lightsArray),j.sortObjects===!0&&w.sort(xe,Se),Ne=ct.enabled===!1||ct.isPresenting===!1||ct.hasDepthSensing()===!1,Ne&&Ze.addToRenderList(w,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),De===!0&&Ye.beginShadows();let i=O.state.shadowsArray;if(Xe.render(i,e,t),De===!0&&Ye.endShadows(),(r&&te.hasRenderPass())===!1){let n=w.opaque,r=w.transmissive;if(O.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];St(n,r,e,a)}Ne&&Ze.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];xt(w,e,n,n.viewport)}}else r.length>0&&St(n,r,e,t),Ne&&Ze.render(e),xt(w,e,t)}N!==null&&ue===0&&(ze.updateMultisampleRenderTarget(N),ze.updateRenderTargetMipmap(N)),r&&te.end(j),e.isScene===!0&&e.onAfterRender(j,e,t),rt.resetDefaultState(),de=-1,fe=null,A.pop(),A.length>0?(O=A[A.length-1],ze.setTextureUnits(O.state.textureUnits),De===!0&&Ye.setGlobalState(j.clippingPlanes,O.state.camera)):O=null,k.pop(),w=k.length>0?k[k.length-1]:null,M!==null&&M.renderEnd()};function bt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)O.pushLightProbeGrid(e);else if(e.isLight)O.pushLight(e),e.castShadow&&O.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(Ee)){r&&je.setFromMatrixPosition(e.matrixWorld).applyMatrix4(ke);let i=Ue.update(e),a=e.material;a.visible&&w.push(e,i,a,n,je.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(Ee))){let i=Ue.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),je.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),je.copy(e.boundingSphere.center)),je.applyMatrix4(e.matrixWorld).applyMatrix4(ke)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&w.push(e,i,c,n,je.z,s,t)}}else a.visible&&w.push(e,i,a,n,je.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)bt(i[e],t,n,r)}function xt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;O.setupLightsView(n),De===!0&&Ye.setGlobalState(j.clippingPlanes,n),r&&F.viewport(pe.copy(r)),i.length>0&&H(i,t,n),a.length>0&&H(a,t,n),o.length>0&&H(o,t,n),F.buffers.depth.setTest(!0),F.buffers.depth.setMask(!0),F.buffers.color.setMask(!0),F.setPolygonOffset(!1)}function St(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(O.state.transmissionRenderTarget[r.id]===void 0){let e=Ie.has(`EXT_color_buffer_half_float`)||Ie.has(`EXT_color_buffer_float`);O.state.transmissionRenderTarget[r.id]=new Bt(1,1,{generateMipmaps:!0,type:e?T:v,minFilter:_,samples:Math.max(4,Le.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Dt.workingColorSpace})}let a=O.state.transmissionRenderTarget[r.id],o=r.viewport||pe;a.setSize(o.z*j.transmissionResolutionScale,o.w*j.transmissionResolutionScale);let s=j.getRenderTarget(),c=j.getActiveCubeFace(),l=j.getActiveMipmapLevel();j.setRenderTarget(a),j.getClearColor(ge),_e=j.getClearAlpha(),_e<1&&j.setClearColor(16777215,.5),j.clear(),Ne&&Ze.render(n);let u=j.toneMapping;j.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),O.setupLightsView(r),De===!0&&Ye.setGlobalState(j.clippingPlanes,r),H(e,n,r),ze.updateMultisampleRenderTarget(a),ze.updateRenderTargetMipmap(a),Ie.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,Ct(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(ze.updateMultisampleRenderTarget(a),ze.updateRenderTargetMipmap(a))}j.setRenderTarget(s,c,l),j.setClearColor(ge,_e),d!==void 0&&(r.viewport=d),j.toneMapping=u}function H(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&Ct(o,t,n,s,l,c)}}function Ct(e,t,n,r,i,a){M!==null&&i.isNodeMaterial&&M.setObject(e,i),e.onBeforeRender(j,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(j,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,j.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,j.renderBufferDirect(n,t,r,i,e,a),i.side=2):j.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(j,t,n,r,i,a)}function wt(e,t,n){t.isScene!==!0&&(t=Me);let r=I.get(e),i=O.state.lights,a=O.state.shadowsArray,o=i.state.version,s=We.getParameters(e,i.state,a,t,n,O.state.lightProbeGridArray),c=We.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Be.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,pt),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return Et(e,s),d}else s.uniforms=We.getUniforms(e),M!==null&&e.isNodeMaterial&&M.build(e,n,s),e.onBeforeCompile(s,j),d=We.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Ye.uniform),Et(e,s),r.needsLights=jt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=O.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function Tt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=yl.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function Et(e,t){let n=I.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function Ot(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];S.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(S))return n}return null}function kt(e,t,n,r,i){t.isScene!==!0&&(t=Me),ze.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=N===null?j.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:Dt.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Be.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(h=j.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=I.get(r),y=O.state.lights;if(De===!0&&(Oe===!0||e!==fe)){let t=e===fe&&r.id===de;Ye.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Ye.numPlanes||v.numIntersection!==Ye.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=O.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let x=v.currentProgram;b===!0&&(x=wt(r,t,i),M&&r.isNodeMaterial&&M.onUpdateProgram(r,x,v));let S=!1,C=!1,w=!1,T=x.getUniforms(),E=v.uniforms;if(F.useProgram(x.program)&&(S=!0,C=!0,w=!0),r.id!==de&&(de=r.id,C=!0),v.needsLights){let e=Ot(O.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,C=!0)}if(S||fe!==e){F.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),T.setValue(P,`projectionMatrix`,e.projectionMatrix),T.setValue(P,`viewMatrix`,e.matrixWorldInverse);let t=T.map.cameraPosition;t!==void 0&&t.setValue(P,Ae.setFromMatrixPosition(e.matrixWorld)),Le.logarithmicDepthBuffer&&T.setValue(P,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&T.setValue(P,`isOrthographic`,e.isOrthographicCamera===!0),fe!==e&&(fe=e,C=!0,w=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&T.setValue(P,`sunShadowMap`,y.state.sunShadowMap,ze),y.state.directionalShadowMap.length>0&&T.setValue(P,`directionalShadowMap`,y.state.directionalShadowMap,ze),y.state.spotShadowMap.length>0&&T.setValue(P,`spotShadowMap`,y.state.spotShadowMap,ze),y.state.pointShadowMap.length>0&&T.setValue(P,`pointShadowMap`,y.state.pointShadowMap,ze)),i.isSkinnedMesh){T.setOptional(P,i,`bindMatrix`),T.setOptional(P,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),T.setValue(P,`boneTexture`,e.boneTexture,ze))}i.isBatchedMesh&&(T.setOptional(P,i,`batchingTexture`),T.setValue(P,`batchingTexture`,i._matricesTexture,ze),T.setOptional(P,i,`batchingIdTexture`),T.setValue(P,`batchingIdTexture`,i._indirectTexture,ze),T.setOptional(P,i,`batchingColorTexture`),i._colorsTexture!==null&&T.setValue(P,`batchingColorTexture`,i._colorsTexture,ze));let D=n.morphAttributes;if((D.position!==void 0||D.normal!==void 0||D.color!==void 0)&&Qe.update(i,n,x),(C||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,T.setValue(P,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(E.envMapIntensity.value=t.environmentIntensity),E.dfgLUT!==void 0&&(E.dfgLUT.value=Bu()),C){if(T.setValue(P,`toneMappingExposure`,j.toneMappingExposure),v.needsLights&&At(E,w),a&&r.fog===!0&&Ge.refreshFogUniforms(E,a),Ge.refreshMaterialUniforms(E,r,be,ye,O.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;E.probesSH.value=e.texture,E.probesMin.value.copy(e.boundingBox.min),E.probesMax.value.copy(e.boundingBox.max),E.probesResolution.value.copy(e.resolution)}yl.upload(P,Tt(v),E,ze)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(yl.upload(P,Tt(v),E,ze),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&T.setValue(P,`center`,i.center),T.setValue(P,`modelViewMatrix`,i.modelViewMatrix),T.setValue(P,`normalMatrix`,i.normalMatrix),T.setValue(P,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];at.update(n,x),at.bind(n,x)}}return x}function At(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function jt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return le},this.getActiveMipmapLevel=function(){return ue},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(e,t,n){let r=I.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),I.get(e.texture).__webglTexture=t,I.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=I.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){N=e,le=t,ue=n;let r=null,i=!1,a=!1;if(e){let o=I.get(e);if(o.__useDefaultFramebuffer!==void 0){F.bindFramebuffer(P.FRAMEBUFFER,o.__webglFramebuffer),pe.copy(e.viewport),me.copy(e.scissor),he=e.scissorTest,F.viewport(pe),F.scissor(me),F.setScissorTest(he),de=-1;return}if(o.__webglFramebuffer===void 0)ze.setupRenderTarget(e);else if(o.__hasExternalTextures)ze.rebindTextures(e,I.get(e.texture).__webglTexture,I.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&I.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);ze.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=I.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&ze.useMultisampledRTT(e)===!1?I.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,pe.copy(e.viewport),me.copy(e.scissor),he=e.scissorTest}else pe.copy(Ce).multiplyScalar(be).floor(),me.copy(we).multiplyScalar(be).floor(),he=Te;if(n!==0&&(r=re),F.bindFramebuffer(P.FRAMEBUFFER,r)&&F.drawBuffers(e,r),F.viewport(pe),F.scissor(me),F.setScissorTest(he),i){let r=I.get(e.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=I.get(e.textures[t]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=I.get(e.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,t.__webglTexture,n)}de=-1};function Mt(e){let t=I.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Le.textureFormatReadable(e.format),t.__typeReadable=Le.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){R(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=I.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){F.bindFramebuffer(P.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+s);let u=Mt(o);if(u.__formatReadable===!1){R(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){R(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&P.readPixels(t,n,r,i,nt.convert(c),nt.convert(l),a)}finally{let e=N===null?null:I.get(N).__webglFramebuffer;F.bindFramebuffer(P.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=I.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){F.bindFramebuffer(P.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+s);let d=Mt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,f),P.bufferData(P.PIXEL_PACK_BUFFER,a.byteLength,P.STREAM_READ),P.readPixels(t,n,r,i,nt.convert(l),nt.convert(u),0),P.bindBuffer(P.PIXEL_PACK_BUFFER,null);let p=N===null?null:I.get(N).__webglFramebuffer;F.bindFramebuffer(P.FRAMEBUFFER,p);let m=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await lt(P,m,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,f),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,a),P.bindBuffer(P.PIXEL_PACK_BUFFER,null),P.deleteBuffer(f),P.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;ze.setTexture2D(e,0),P.copyTexSubImage2D(P.TEXTURE_2D,n,0,0,o,s,i,a),F.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=nt.convert(t.format),_=nt.convert(t.type),v;t.isData3DTexture?(ze.setTexture3D(t,0),v=P.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(ze.setTexture2DArray(t,0),v=P.TEXTURE_2D_ARRAY):(ze.setTexture2D(t,0),v=P.TEXTURE_2D),F.activeTexture(P.TEXTURE0),F.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,t.flipY),F.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),F.pixelStorei(P.UNPACK_ALIGNMENT,t.unpackAlignment);let y=F.getParameter(P.UNPACK_ROW_LENGTH),b=F.getParameter(P.UNPACK_IMAGE_HEIGHT),x=F.getParameter(P.UNPACK_SKIP_PIXELS),S=F.getParameter(P.UNPACK_SKIP_ROWS),C=F.getParameter(P.UNPACK_SKIP_IMAGES);F.pixelStorei(P.UNPACK_ROW_LENGTH,h.width),F.pixelStorei(P.UNPACK_IMAGE_HEIGHT,h.height),F.pixelStorei(P.UNPACK_SKIP_PIXELS,l),F.pixelStorei(P.UNPACK_SKIP_ROWS,u),F.pixelStorei(P.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=I.get(e),r=I.get(t),h=I.get(n.__renderTarget),g=I.get(r.__renderTarget);F.bindFramebuffer(P.READ_FRAMEBUFFER,h.__webglFramebuffer),F.bindFramebuffer(P.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,I.get(e).__webglTexture,i,d+n),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,I.get(t).__webglTexture,a,m+n)),P.blitFramebuffer(l,u,o,s,f,p,o,s,P.DEPTH_BUFFER_BIT,P.NEAREST);F.bindFramebuffer(P.READ_FRAMEBUFFER,null),F.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||I.has(e)){let n=I.get(e),r=I.get(t);F.bindFramebuffer(P.READ_FRAMEBUFFER,ae),F.bindFramebuffer(P.DRAW_FRAMEBUFFER,ce);for(let e=0;e<c;e++)w?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,n.__webglTexture,i),T?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,r.__webglTexture,a),i===0?T?P.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):P.copyTexSubImage2D(v,a,f,p,l,u,o,s):P.blitFramebuffer(l,u,o,s,f,p,o,s,P.COLOR_BUFFER_BIT,P.NEAREST);F.bindFramebuffer(P.READ_FRAMEBUFFER,null),F.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?P.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?P.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):P.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):P.texSubImage2D(P.TEXTURE_2D,a,f,p,o,s,g,_,h);F.pixelStorei(P.UNPACK_ROW_LENGTH,y),F.pixelStorei(P.UNPACK_IMAGE_HEIGHT,b),F.pixelStorei(P.UNPACK_SKIP_PIXELS,x),F.pixelStorei(P.UNPACK_SKIP_ROWS,S),F.pixelStorei(P.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&P.generateMipmap(v),F.unbindTexture()},this.initRenderTarget=function(e){I.get(e).__webglFramebuffer===void 0&&ze.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?ze.setTextureCube(e,0):e.isData3DTexture?ze.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?ze.setTexture2DArray(e,0):ze.setTexture2D(e,0),F.unbindTexture()},this.resetState=function(){le=0,ue=0,N=null,F.reset(),rt.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return et}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Dt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Dt._getUnpackColorSpace()}},Hu=(e,t,n)=>Math.min(n,Math.max(t,e)),Uu=(e,t,n)=>e+(t-e)*n,Wu=(e,t,n)=>{let r=Hu((n-e)/(t-e),0,1);return r*r*(3-2*r)};function Gu(e,t){let n=(t-e)%(Math.PI*2);return n>Math.PI&&(n-=Math.PI*2),n<-Math.PI&&(n+=Math.PI*2),n}function Ku(e,t,n,r){return e+Gu(e,t)*(1-Math.exp(-n*r))}function qu(e){return function(){e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}var Ju=(e=0,t=1)=>e+Math.random()*(t-e),Yu=e=>e[Math.floor(Math.random()*e.length)],Xu=e=>Math.random()<e;function Zu(e){let t=Math.floor((e%1+1)%1*1440);return String(Math.floor(t/60)).padStart(2,`0`)+`:`+String(t%60).padStart(2,`0`)}var Qu=()=>(`ontouchstart`in window||navigator.maxTouchPoints>0)&&matchMedia(`(pointer: coarse)`).matches,$u={high:{name:`high`,dpr:2,shadows:2048,oceanRings:150,oceanSegs:320,waterDetail:1,clouds:!0,cloudOctaves:5,birds:16,dolphins:5,ruins:!0,debris:36},mid:{name:`mid`,dpr:1.5,shadows:1024,oceanRings:100,oceanSegs:210,waterDetail:.8,clouds:!0,cloudOctaves:4,birds:10,dolphins:4,ruins:!0,debris:24},low:{name:`low`,dpr:1,shadows:0,oceanRings:64,oceanSegs:120,waterDetail:.45,clouds:!0,cloudOctaves:2,birds:6,dolphins:3,ruins:!0,debris:14}},ed=[`high`,`mid`,`low`];function td(){let e=new URLSearchParams(location.search);if(e.get(`q`)&&$u[e.get(`q`)])return{level:e.get(`q`),locked:!0};let t=localStorage.getItem(`ark.quality`);if(t&&$u[t])return{level:t,locked:!0};let n=Qu()||Math.min(screen.width,screen.height)<520,r=navigator.deviceMemory||4;return n?{level:r>=6?`mid`:`low`,locked:!1}:{level:`high`,locked:!1}}var nd=(e,t,n)=>new U(e,t,n),rd=new U,id=new U,ad=(e,t,n,r)=>e.copy(t).lerp(n,Hu(r,0,1)),od=`
varying vec3 vDir;
void main(){
  vDir = normalize(position);
  vec4 p = modelViewMatrix * vec4(position,1.0);
  gl_Position = projectionMatrix * p;
  gl_Position.z = gl_Position.w; // 永遠在最遠處
}`,sd=`
precision highp float;
varying vec3 vDir;
uniform vec3 uZenith, uHorizon, uGlow, uSunDir, uMoonDir, uSunCol;
uniform float uStars, uTime, uSunVis, uMoonVis, uCloudCover, uQual, uDay;
float hash(vec3 p){ p = fract(p*0.3183099+.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float hash2(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float noise2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash2(i),hash2(i+vec2(1,0)),f.x), mix(hash2(i+vec2(0,1)),hash2(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float a=.5, s=0.; for(int i=0;i<5;i++){ if(float(i)>=uQual) break; s+=a*noise2(p); p=p*2.03+17.1; a*=.5; } return s; }
void main(){
  vec3 d = normalize(vDir);
  float y = d.y;
  vec3 col = mix(uHorizon, uZenith, pow(clamp(y,0.0,1.0), 0.55));
  if (y < 0.0) col = mix(uHorizon, uHorizon*0.7, clamp(-y*4.0,0.0,1.0));
  // 太陽光暈
  float sd = max(dot(d, uSunDir), 0.0);
  col += uGlow * (pow(sd, 6.0)*0.35 + pow(sd, 48.0)*0.5) * uSunVis;
  float disk = smoothstep(0.9996, 0.9999, sd);
  col += uSunCol * disk * 4.0 * uSunVis;
  // 星空
  if (y > -0.02 && uStars > 0.01) {
    vec3 p = d*220.0; vec3 id=floor(p); vec3 f=fract(p)-0.5;
    float h = hash(id); float st = step(0.965, h) * smoothstep(0.42, 0.0, length(f));
    float tw = 0.65 + 0.35*sin(uTime*(1.5+h*4.0)+h*60.0);
    vec3 p2 = d*70.0; vec3 id2=floor(p2); vec3 f2=fract(p2)-0.5; float h2=hash(id2+7.0);
    float st2 = step(0.985, h2) * smoothstep(0.35,0.0,length(f2)) * 1.6;
    vec3 sc = mix(vec3(0.7,0.8,1.0), vec3(1.0,0.9,0.75), fract(h*91.0));
    // 銀河
    vec3 bn = normalize(vec3(0.35,0.55,0.75));
    float band = exp(-pow(dot(d,bn)*3.2, 2.0));
    float mw = band * (0.25 + 0.75*noise2(d.xz*9.0+d.y*5.0)) * 0.22 * uQual/5.0;
    col += (sc*(st*tw + st2*tw)*1.4 + vec3(0.45,0.5,0.8)*mw) * uStars * smoothstep(-0.02,0.12,y);
  }
  // 月亮
  float md = dot(d, uMoonDir);
  float mdisk = smoothstep(0.99935, 0.99965, md);
  vec3 mcol = vec3(0.92,0.94,1.0) * (0.75 + 0.25*noise2(d.xz*400.0 + d.y*300.0));
  col = mix(col, mcol*1.25, mdisk * uMoonVis);
  col += vec3(0.35,0.42,0.7) * (pow(max(md,0.0), 90.0)*0.35 + pow(max(md,0.0), 14.0)*0.06) * uMoonVis;
  // 雲
  if (y > 0.015 && uCloudCover > 0.01) {
    vec2 q = d.xz / (y + 0.14) * 0.9 + vec2(uTime*0.004, uTime*0.0015);
    float n = fbm(q*1.6);
    float dens = smoothstep(1.0 - uCloudCover, 1.0 - uCloudCover + 0.28, n) * smoothstep(0.015, 0.22, y);
    float lit = 0.55 + 0.45*clamp(dot(normalize(vec3(d.x,0.3,d.z)), uSunDir)*0.5+0.5, 0.0, 1.0);
    vec3 cc = mix(uHorizon*0.55+vec3(0.05), vec3(1.0)*uDay + uGlow*0.9*(1.0-uDay)*0.6 + vec3(0.06,0.07,0.12), lit);
    cc = mix(cc, uGlow*1.1+uHorizon*0.4, pow(sd, 3.0)*0.7*uSunVis);
    col = mix(col, cc, dens*0.92);
  }
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,cd=class{constructor(e,t,n){this.scene=e,this.renderer=t,this.q=n,this.uniforms={uZenith:{value:new U},uHorizon:{value:new U},uGlow:{value:new U},uSunDir:{value:new V(0,1,0)},uMoonDir:{value:new V(0,-1,0)},uSunCol:{value:new U(1,1,.9)},uStars:{value:0},uTime:{value:0},uSunVis:{value:1},uMoonVis:{value:0},uCloudCover:{value:.5},uQual:{value:5},uDay:{value:1}},this.sky=new G(new no(1,48,24),new mo({uniforms:this.uniforms,vertexShader:od,fragmentShader:sd,side:1,depthWrite:!1,depthTest:!1,fog:!1})),this.sky.scale.setScalar(6e3),this.sky.renderOrder=-10,this.sky.frustumCulled=!1,e.add(this.sky),e.fog=new En(10139344,5e-4),this.sun=new es(16777215,2.5),this.sun.castShadow=n.shadows>0,this.moon=new es(9414911,.3),this.hemi=new zo(12376319,4214880,.7),e.add(this.sun,this.sun.target,this.moon,this.moon.target,this.hemi),this.configureShadow(),this.lampMat=new go({color:16773577,emissive:16767130,emissiveIntensity:0,roughness:.4}),this.windowMat=new go({color:1713200,emissive:16766090,emissiveIntensity:0,roughness:.2}),this.shadowFocus=new V,this.state={},this.palette={zenDay:nd(.16,.4,.78),zenNight:nd(.008,.014,.05),zenDusk:nd(.14,.17,.42),horDay:nd(.66,.8,.93),horNight:nd(.035,.055,.11),horDusk:nd(1,.5,.26),glowDusk:nd(1,.45,.16),glowDay:nd(1,.85,.6)},this.waterDeep=new U,this.waterShallow=new U,this.sunDir=new V,this.moonDir=new V}configureShadow(){let e=this.sun.shadow,t=this.q.shadows;t?(this.sun.castShadow=!0,e.mapSize.set(t,t),Object.assign(e.camera,{left:-38,right:38,top:38,bottom:-38,near:1,far:260}),e.camera.updateProjectionMatrix(),e.bias=-6e-4,e.normalBias=.04,e.map&&(e.map.dispose(),e.map=null)):this.sun.castShadow=!1}setQuality(e){this.q=e,this.configureShadow(),this.uniforms.uQual.value=e.cloudOctaves}update(e,t,n,r){let i=(e-.25)*Math.PI*2,a=Math.sin(i);this.sunDir.set(Math.cos(i)*.82,a,Math.cos(i)*.57+0).normalize(),this.sunDir.set(Math.cos(i)*.9,Math.max(a,-1)*.92+0,-.35+Math.cos(i)*.1).normalize(),this.moonDir.set(-Math.cos(i)*.7-.2,-a*.9+.05,.55).normalize();let o=this.sunDir.y,s=Wu(-.1,.25,o),c=Math.exp(-((o/.2)**2)),l=1-Wu(-.14,.08,o),u=this.palette,d=this.uniforms;ad(d.uZenith.value,u.zenNight,u.zenDay,s),ad(d.uZenith.value,d.uZenith.value,u.zenDusk,c*.55),ad(d.uHorizon.value,u.horNight,u.horDay,s),ad(d.uHorizon.value,d.uHorizon.value,u.horDusk,c*.85),ad(d.uGlow.value,u.glowDay,u.glowDusk,c),d.uSunDir.value.copy(this.sunDir),d.uMoonDir.value.copy(this.moonDir),d.uSunVis.value=Wu(-.12,0,o),d.uMoonVis.value=Wu(-.02,.15,this.moonDir.y)*(1-s*.9),d.uStars.value=Hu(l*1.2,0,1)*Wu(.1,-.04,o+0),d.uStars.value=Hu(1-Wu(-.2,.02,o),0,1),d.uTime.value=t,d.uDay.value=s,d.uCloudCover.value=this.q.clouds?.52:0,d.uSunCol.value.setRGB(1,Uu(.55,.96,Wu(0,.4,o)),Uu(.25,.85,Wu(0,.4,o))),this.sky.position.copy(n.position);let f=3.1*Wu(-.04,.32,o);return rd.setRGB(1,Uu(.52,.95,Wu(0,.45,o)),Uu(.28,.86,Wu(0,.45,o))),this.sun.color.copy(rd),this.sun.intensity=f,this.focusSet(r),this.sun.position.copy(this.shadowFocus).addScaledVector(this.sunDir,120),this.sun.target.position.copy(this.shadowFocus),this.moon.intensity=1.25*Wu(-.02,.2,this.moonDir.y)*(1-s),this.moon.position.copy(this.shadowFocus).addScaledVector(this.moonDir,100),this.moon.target.position.copy(this.shadowFocus),this.hemi.color.copy(d.uZenith.value).lerp(d.uHorizon.value,.45).multiplyScalar(1).addScalar(.04),this.hemi.groundColor.setRGB(.22,.2,.2).lerp(id.setRGB(.05,.06,.1),l),this.hemi.intensity=Uu(.78,.95,s)+c*0,this.scene.fog.color.copy(d.uHorizon.value).multiplyScalar(.92),this.scene.fog.density=Uu(62e-5,42e-5,s)*(1+c*.4),this.scene.background=null,this.lampMat.emissiveIntensity=.05+l*2.4,this.windowMat.emissiveIntensity=l*1.6,ad(this.waterDeep,nd(.004,.014,.035),nd(.02,.125,.21),s),this.waterDeep.lerp(nd(.03,.06,.12),c*.25),ad(this.waterShallow,nd(.01,.03,.06),nd(.07,.31,.37),s),this.renderer.toneMappingExposure=Uu(1.3,.9,s),Object.assign(this.state,{es:o,dayF:s,duskF:c,nightF:l}),this.state}focusSet(e){e&&this.shadowFocus.set(Math.round(e.x/2)*2,Math.round(e.y/2)*2,Math.round(e.z/2)*2)}},ld=[{a:.35,L:78,A:.62},{a:-.55,L:46,A:.38},{a:1.15,L:28,A:.2},{a:2.3,L:17,A:.1},{a:.8,L:10,A:.05}],ud=9.8;for(let e of ld)e.k=Math.PI*2/e.L,e.w=Math.sqrt(ud*e.k),e.dx=Math.cos(e.a),e.dz=Math.sin(e.a);var dd={amp:1};function fd(e,t,n){let r=0;for(let i of ld)r+=i.A*Math.sin(i.k*(i.dx*e+i.dz*t)-i.w*n);return r*dd.amp}var pd=ld.length,md=`
uniform float uTime, uAmp;
uniform vec4 uW[${pd}]; // dirx, dirz, k, A
uniform float uWs[${pd}]; // omega
varying vec3 vWorld; varying float vH; varying float vDist; varying vec2 vGrad;
void main(){
  vec3 p = position;
  float h = 0.0; vec2 g = vec2(0.0);
  for(int i=0;i<${pd};i++){
    vec4 w = uW[i];
    float ph = w.z*(w.x*p.x + w.y*p.z) - uWs[i]*uTime;
    h += w.w*sin(ph);
    float c = w.w*w.z*cos(ph);
    g += c*w.xy;
  }
  h *= uAmp; g *= uAmp;
  p.y = h;
  vH = h; vGrad = g;
  vec4 wp = modelMatrix * vec4(p,1.0);
  vWorld = wp.xyz;
  vec4 mv = viewMatrix * wp;
  vDist = length(mv.xyz);
  gl_Position = projectionMatrix * mv;
}`,hd=`
precision highp float;
uniform float uTime, uAmp, uDetail;
uniform vec3 uDeep, uShallow, uZenith, uHorizon, uGlow, uSunDir, uSunCol, uMoonDir, uFog;
uniform float uFogD, uDay, uMoonVis, uSunVis, uShipHL, uShipHW;
varying vec3 vWorld; varying float vH; varying float vDist; varying vec2 vGrad;
float hash2(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash2(i),hash2(i+vec2(1,0)),f.x), mix(hash2(i+vec2(0,1)),hash2(i+vec2(1,1)),f.x), f.y); }
vec3 skyCol(vec3 d){
  float y = clamp(d.y, 0.0, 1.0);
  vec3 c = mix(uHorizon, uZenith, pow(y, 0.5));
  float sd = max(dot(d, uSunDir), 0.0);
  c += uGlow * (pow(sd, 6.0)*0.3 + pow(sd,48.0)*0.5) * uSunVis;
  return c;
}
float hullHW(float x){
  // 與船體外形一致的簡化寬度
  float xs = -${46 .toFixed(1)}, xb = 46.0, bl = 14.0;
  if (x < xs) return 0.0;
  if (x < xs+3.0) return uShipHW*(0.84+0.16*(x-xs)/3.0);
  if (x < xb) return uShipHW;
  float u = (x-xb)/bl; if (u>1.0) return 0.0;
  return uShipHW*pow(max(1.0-pow(u,1.7),0.0),0.85);
}
void main(){
  vec3 V = normalize(cameraPosition - vWorld);
  vec2 wp = vWorld.xz;
  // 細節法線（高頻小波）
  float t = uTime;
  vec2 d1 = vec2(noise(wp*0.9 + vec2(t*0.35, t*0.2)), noise(wp*0.9 + 31.7 - vec2(t*0.25, -t*0.3)));
  vec2 d2 = vec2(noise(wp*2.7 + vec2(-t*0.6, t*0.5)), noise(wp*2.7 + 11.3 + vec2(t*0.5, t*0.4)));
  vec2 dn = ((d1-0.5)*0.55 + (d2-0.5)*0.35) * uDetail * (1.0/(1.0+vDist*0.012));
  vec3 N = normalize(vec3(-vGrad.x + dn.x, 1.0, -vGrad.y + dn.y));
  float ndv = max(dot(N,V), 0.0);
  float F = 0.02 + 0.98*pow(1.0-ndv, 5.0);
  F = clamp(F*1.0, 0.0, 1.0);
  vec3 R = reflect(-V, N); R.y = abs(R.y);
  vec3 refl = skyCol(R);
  float sunSpec = pow(max(dot(R, uSunDir), 0.0), 220.0) * 3.2 + pow(max(dot(R, uSunDir), 0.0), 24.0)*0.18;
  float moonSpec = pow(max(dot(R, uMoonDir), 0.0), 400.0) * 1.6 + pow(max(dot(R, uMoonDir), 0.0), 40.0)*0.05;
  vec3 spec = uSunCol*sunSpec*uSunVis + vec3(0.7,0.8,1.0)*moonSpec*uMoonVis;
  // 水體：深色 + 浪尖次表面散射
  float crest = clamp(vH/(0.9*uAmp+0.001) * 0.5 + 0.5, 0.0, 1.0);
  vec3 body = mix(uDeep, uShallow, pow(crest, 2.2)*0.8 + (1.0-ndv)*0.12);
  vec3 col = mix(body, refl, F) + spec;
  // 泡沫：浪尖 + 船身周圍
  float fn = noise(wp*1.3 + vec2(t*0.1, -t*0.07)) * 0.6 + noise(wp*4.1 - t*0.2)*0.4;
  float foam = smoothstep(0.94, 1.05, crest + (fn-0.5)*0.3) * 0.26;
  float dx = vWorld.x, dz = abs(vWorld.z);
  float hw = hullHW(dx);
  float dd = dz - hw;
  float outside = (hw > 0.0) ? dd : length(vec2(dx < 0.0 ? dx + 46.0 : dx - 60.0, dz));
  float ring = smoothstep(3.2, 0.2, outside) * smoothstep(-8.0, 0.0, outside) * (0.45 + 0.75*fn);
  foam = max(foam, ring*0.85);
  vec3 foamCol = mix(vec3(0.8,0.88,0.92), uHorizon*1.1+0.1, 0.25) * (0.06 + 0.94*uDay);
  col = mix(col, foamCol, clamp(foam,0.0,1.0));
  // 霧
  float f = 1.0 - exp(-pow(vDist*uFogD, 2.0));
  col = mix(col, uFog, clamp(f,0.0,1.0));
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;function gd(e,t,n,r){let i=[],a=[],o=[0],s=Math.floor(e*.62);for(let e=1;e<=s;e++)o.push(e/s*r);let c=e-s;for(let e=1;e<=c;e++)o.push(r*(n/r)**+(e/c));i.push(0,0,0);for(let e=1;e<o.length;e++)for(let n=0;n<t;n++){let r=n/t*Math.PI*2;i.push(Math.cos(r)*o[e],0,Math.sin(r)*o[e])}for(let e=0;e<t;e++)a.push(0,1+(e+1)%t,1+e);for(let e=1;e<o.length-1;e++)for(let n=0;n<t;n++){let r=1+(e-1)*t+n,i=1+(e-1)*t+(n+1)%t,o=1+e*t+n,s=1+e*t+(n+1)%t;a.push(r,i,o,i,s,o)}let l=new br;return l.setAttribute(`position`,new W(i,3)),l.setIndex(a),l.boundingSphere=new fr(new V,n*1.1),l}var _d=class{constructor(e,t,n){this.env=t;let r=t.uniforms;this.uniforms={uTime:{value:0},uAmp:{value:1},uDetail:{value:n.waterDetail},uW:{value:ld.map(e=>new Rt(e.dx,e.dz,e.k,e.A))},uWs:{value:ld.map(e=>e.w)},uDeep:{value:t.waterDeep},uShallow:{value:t.waterShallow},uZenith:r.uZenith,uHorizon:r.uHorizon,uGlow:r.uGlow,uSunDir:r.uSunDir,uSunCol:r.uSunCol,uMoonDir:r.uMoonDir,uFog:{value:e.fog.color},uFogD:{value:5e-4},uDay:r.uDay,uMoonVis:r.uMoonVis,uSunVis:r.uSunVis,uShipHL:{value:46},uShipHW:{value:13.6}},this.mat=new mo({uniforms:this.uniforms,vertexShader:md,fragmentShader:hd,fog:!1}),this.scene=e,this.build(n)}build(e){this.mesh&&(this.scene.remove(this.mesh),this.mesh.geometry.dispose());let t=gd(e.oceanRings,e.oceanSegs,5200,170);this.mesh=new G(t,this.mat),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-1,this.scene.add(this.mesh),this.uniforms.uDetail.value=e.waterDetail}update(e,t){this.uniforms.uTime.value=e,this.uniforms.uAmp.value=t,this.uniforms.uFogD.value=this.env.scene.fog.density}};function vd(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new br,l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let e in d.morphAttributes){if(!i.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;o[e]===void 0&&(o[e]=[]),o[e].push(d.morphAttributes[e])}if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=yd(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=yd(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function yd(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new or(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}function bd(){let e=document.createElement(`canvas`);e.width=e.height=256;let t=e.getContext(`2d`),n=[`#b08556`,`#a67b4d`,`#b88d5e`,`#a07448`,`#ad8254`];for(let e=0;e<8;e++){t.fillStyle=n[e*3%n.length],t.fillRect(0,e*32,256,32),t.fillStyle=`rgba(60,35,15,.55)`,t.fillRect(0,e*32,256,2);for(let n=0;n<3;n++)t.fillStyle=`rgba(60,35,15,.5)`,t.fillRect((e*97+n*83)%256,e*32,2,32);for(let n=0;n<20;n++)t.fillStyle=`rgba(80,50,20,.08)`,t.fillRect(Math.random()*256,e*32+Math.random()*30,40+Math.random()*60,1)}let r=new Ei(e);return r.wrapS=r.wrapT=l,r.colorSpace=Je,r.anisotropy=4,r.repeat.set(.25,.25),r}var J=(e,t={})=>new go({color:e,roughness:.7,metalness:0,...t});function xd(e){let t={white:J(15856629,{roughness:.55}),offwhite:J(14672870,{roughness:.6}),hullBlue:J(1320255,{roughness:.5,metalness:.15}),red:J(12728882),darkred:J(8003359),orange:J(15235114),yellow:J(15909424),green:J(3971668),darkgreen:J(2779708),leaf:J(4165450,{roughness:.85}),leaf2:J(5941338,{roughness:.85}),blue:J(3106504),lightblue:J(6927080),pink:J(14183066),purple:J(7162536),teak:J(16777215,{roughness:.78,map:bd()}),wood:J(9132587,{roughness:.7}),woodDark:J(4861724,{roughness:.65}),woodLight:J(13674098,{roughness:.7}),carpet:J(3820136,{roughness:1}),carpet2:J(8010555,{roughness:1}),rug:J(12160858,{roughness:1}),tile:J(13226968,{roughness:.35}),tileBlue:J(3840964,{roughness:.3}),tileDark:J(7042169,{roughness:.5}),steel:J(11121595,{roughness:.4,metalness:.3}),steelDark:J(5660778,{roughness:.5,metalness:.2}),black:J(1316378,{roughness:.5}),rubber:J(12076079,{roughness:.9}),courtBlue:J(2974392,{roughness:.75}),courtGreen:J(3115594,{roughness:.8}),courtLine:J(16119285,{roughness:.6}),asphalt:J(3882821,{roughness:.9}),grass:J(3967548,{roughness:1}),sofa:J(4942472,{roughness:.95}),sofa2:J(10900042,{roughness:.95}),leather:J(3024418,{roughness:.55}),fabricW:J(15328474,{roughness:1}),fabricB:J(5998276,{roughness:1}),fabricP:J(12876448,{roughness:1}),fabricG:J(7317626,{roughness:1}),fabricY:J(14200906,{roughness:1}),glass:new go({color:12575730,roughness:.05,metalness:.1,transparent:!0,opacity:.22,depthWrite:!1}),glassTint:new go({color:5929612,roughness:.05,metalness:.2,transparent:!0,opacity:.35,depthWrite:!1}),rail:J(14673642,{roughness:.3,metalness:.5}),water:new go({color:3716320,roughness:.08,metalness:0,transparent:!0,opacity:.82}),pot:J(11558970),concrete:J(9278102,{roughness:.95}),rust:J(9062954,{roughness:.95}),crate:J(10121280,{roughness:.9}),cargoBlue:J(2775690),cargoRed:J(10107434),cargoGreen:J(3828298),lamp:e.lampMat,windowLit:e.windowMat,skin:J(1578e4,{roughness:.8}),cream:J(15985368,{roughness:.9}),heliBody:J(14212576,{roughness:.3,metalness:.3}),heliRed:J(13380395,{roughness:.4}),sunshade:J(16117728,{roughness:1}),funnel:J(13122090,{roughness:.5})};return t.sunshade.side=2,t}var Sd=new Ut,Cd=new bt,wd=new $t,Td=new V,Ed=new V(1,1,1);function Dd(e,t,n,r,i=0,a=0,o=0,s=1,c=1,l=1){return wd.set(i,a,o,`YXZ`),Cd.setFromEuler(wd),Td.set(t,n,r),Ed.set(s,c,l),Sd.compose(Td,Cd,Ed),e.applyMatrix4(Sd),e}var Od=class{constructor(e){this.M=e,this.parts=new Map,this.blocks=[],this.extra=[]}add(e,t){t.index&&(t=t.toNonIndexed());for(let e of Object.keys(t.attributes))e!==`position`&&e!==`normal`&&e!==`uv`&&t.deleteAttribute(e);t.attributes.uv||t.setAttribute(`uv`,new or(new Float32Array(t.attributes.position.count*2),2)),this.parts.has(e)||this.parts.set(e,[]),this.parts.get(e).push(t)}box(e,t,n,r,i,a,o=0,s=0){this.add(this.M[e],Dd(new K(r,a,i),t,o+a/2,n,0,s,0))}boxc(e,t,n,r,i,a,o,s=0,c=0,l=0){this.add(this.M[e],Dd(new K(i,a,o),t,n,r,c,s,l))}cyl(e,t,n,r,i,a=0,o=14,s=r){this.add(this.M[e],Dd(new Mi(s,r,i,o),t,a+i/2,n))}cylc(e,t,n,r,i,a,o=12,s=0,c=0,l=0,u=i){this.add(this.M[e],Dd(new Mi(u,i,a,o),t,n,r,s,c,l))}sph(e,t,n,r,i,a=1,o=1,s=1,c=10){this.add(this.M[e],Dd(new no(i,c,Math.max(6,c-2)),t,n,r,0,0,0,a,o,s))}geo(e,t){this.add(this.M[e],t)}block(e,t,n,r){this.blocks.push([Math.min(e,n),Math.min(t,r),Math.max(e,n),Math.max(t,r)])}blockC(e,t,n,r,i=0){let a=Math.abs(Math.cos(i)),o=Math.abs(Math.sin(i)),s=(n*a+r*o)/2,c=(n*o+r*a)/2;this.block(e-s,t-c,e+s,t+c)}wall(e,t,n,r,i,a=`white`,o=.16,s=[],c=0){let l=Math.abs(n-e)>=Math.abs(r-t),u=l?Math.min(e,n):Math.min(t,r),d=l?Math.max(e,n):Math.max(t,r),f=l?t:e,p=[],m=u;for(let[e,t]of[...s].sort((e,t)=>e[0]-t[0]))e>m&&p.push([m,e]),m=Math.max(m,t);m<d&&p.push([m,d]);for(let[e,t]of p){let n=t-e,r=(e+t)/2;l?(this.box(a,r,f,n,o,i,c),this.block(e-.02,f-o/2-.05,t+.02,f+o/2+.05)):(this.box(a,f,r,o,n,i,c),this.block(f-o/2-.05,e-.02,f+o/2+.05,t+.02))}}build(e=!0){let t=new vn;for(let[n,r]of this.parts){let i=vd(r,!1);r.forEach(e=>e.dispose());let a=new G(i,n),o=n.transparent;a.castShadow=e&&!o,a.receiveShadow=e,a.matrixAutoUpdate=!1,t.add(a)}return t}},kd=.5,Ad=class{constructor(){this.a=[]}push(e,t){let n=this.a;n.push([t,e]);let r=n.length-1;for(;r>0;){let e=r-1>>1;if(n[e][0]<=n[r][0])break;[n[e],n[r]]=[n[r],n[e]],r=e}}pop(){let e=this.a,t=e[0],n=e.pop();if(e.length){e[0]=n;let t=0;for(;;){let n=2*t+1,r=n+1,i=t;if(n<e.length&&e[n][0]<e[i][0]&&(i=n),r<e.length&&e[r][0]<e[i][0]&&(i=r),i===t)break;[e[i],e[t]]=[e[t],e[i]],t=i}}return t[1]}get size(){return this.a.length}},jd=class{constructor(){this.cells=new Uint8Array(14848),this.base=new Uint8Array(14848)}idx(e,t){return t*232+e}ix(e){return Math.floor((e- -50)/kd)}iz(e){return Math.floor((e- -16)/kd)}cx(e){return-50+(e+.5)*kd}cz(e){return-16+(e+.5)*kd}inb(e,t){return e>=0&&t>=0&&e<232&&t<64}free(e,t){return this.inb(e,t)&&this.cells[t*232+e]===1}walkable(e,t,n=.28){if(!this.free(this.ix(e),this.iz(t)))return!1;for(let r=0;r<8;r++){let i=r*Math.PI/4;if(!this.free(this.ix(e+Math.cos(i)*n),this.iz(t+Math.sin(i)*n)))return!1}return!0}move(e,t,n,r,i=.28){let a=e+n,o=t+r;return this.walkable(a,o,i)?[a,o]:n!==0&&this.walkable(e+n,t,i)?[e+n,t]:r!==0&&this.walkable(e,t+r,i)?[e,t+r]:[e,t]}los(e,t,n,r){let i=Math.hypot(n-e,r-t),a=Math.max(1,Math.ceil(i/.2));for(let i=0;i<=a;i++){let o=i/a;if(!this.walkable(e+(n-e)*o,t+(r-t)*o,.22))return!1}return!0}nearestFree(e,t,n=8){let r=this.ix(e),i=this.iz(t);if(this.free(r,i))return[this.cx(r),this.cz(i)];for(let e=1;e<n/kd;e++){let t=null,n=1e9;for(let a=-e;a<=e;a++)for(let o=-e;o<=e;o++)if(Math.max(Math.abs(o),Math.abs(a))===e&&this.free(r+o,i+a)){let e=o*o+a*a;e<n&&(n=e,t=[r+o,i+a])}if(t)return[this.cx(t[0]),this.cz(t[1])]}return null}findPath(e,t,n,r){let i=this.nearestFree(e,t),a=this.nearestFree(n,r);if(!i||!a)return null;let o=this.ix(i[0]),s=this.iz(i[1]),c=this.ix(a[0]),l=this.iz(a[1]),u=s*232+o,d=l*232+c;if(u===d)return[[n,r]];let f=new Float32Array(14848).fill(1e9),p=new Int32Array(14848).fill(-1),m=new Uint8Array(14848),h=new Ad;f[u]=0,h.push(u,0);let g=[[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,1.414],[1,-1,1.414],[-1,1,1.414],[-1,-1,1.414]],_=!1;for(;h.size;){let e=h.pop();if(m[e])continue;if(m[e]=1,e===d){_=!0;break}let t=e%232,n=e/232|0;for(let[r,i,a]of g){let o=t+r,s=n+i;if(!this.free(o,s)||r&&i&&(!this.free(t+r,n)||!this.free(t,n+i)))continue;let u=s*232+o,d=f[e]+a;d>=f[u]||(f[u]=d,p[u]=e,h.push(u,d+Math.hypot(c-o,l-s)))}}if(!_)return null;let v=[];for(let e=d;e!==-1;e=p[e])v.push([this.cx(e%232),this.cz(e/232|0)]);v.reverse(),v.push([n,r]);let y=[],b=0,x=[e,t];for(;b<v.length;){let e=v.length-1;for(;e>b&&!this.los(x[0],x[1],v[e][0],v[e][1]);)e--;y.push(v[e]),x=v[e],b=e+1}return y}};function Md(e,t){let{xs:n,xb:r,hz:i,bl:a}=t;if(e<n||e>r+a)return 0;if(e<n+3)return i*(.84+.16*Math.sin((e-n)/3*Math.PI/2));if(e<=r)return i;let o=(e-r)/a;return i*Math.max(1-o**1.7,0)**.85}function Nd(e,t=16){let n=[e.xs,e.xs+.4,e.xs+1.2,e.xs+3];for(let t=1;t<=3;t++)n.push(e.xs+3+(e.xb-e.xs-3)*(t/3));n.pop(),n.push(e.xb);for(let r=1;r<=t;r++)n.push(e.xb+e.bl*Math.min(r/t,.999));let r=e.xb+e.bl,i=n.map(t=>[t,Md(t,e)]);i[i.length-1]=[r-.05,Math.max(Md(r-.05,e),.02)];let a=[];for(let[e,t]of i)a.push([e,-t]);a.push([r,0]);for(let e=i.length-1;e>=0;e--)a.push([i[e][0],i[e][1]]);return a.push([e.xs,0]),a}function Pd(e,t,n){let r=!1;for(let i=0,a=n.length-1;i<n.length;a=i++){let[o,s]=n[i],[c,l]=n[a];s>t!=l>t&&e<(c-o)*(t-s)/(l-s)+o&&(r=!r)}return r}function Fd(e,t,n){let r=1e9;for(let i=0,a=n.length-1;i<n.length;a=i++){let[o,s]=n[a],[c,l]=n[i],u=c-o,d=l-s,f=u*u+d*d||1,p=((e-o)*u+(t-s)*d)/f;p=Math.max(0,Math.min(1,p)),r=Math.min(r,Math.hypot(e-(o+p*u),t-(s+p*d)))}return r}function Id(e,t,n,r){let i=[],a=[],o=[],s=new U(15659507),c=new U(1254205),l=new U(9185828),u=new U(13214282),d=[];for(let t=0;t<=90;t++){let n=t/90;d.push(e.xs+(e.xb+e.bl-e.xs)*(.5-.5*Math.cos(Math.PI*n))*0+(e.xs+(e.xb+e.bl-e.xs)*n-e.xs))}for(let r=0;r<=90;r++){let o=Math.min(d[r],e.xb+e.bl-.02),f=Math.max(Md(o,e),.02),p=Math.max(0,(o-e.xb)/e.bl),m=t+1*p*p+.35*Math.max(0,1-(o-e.xs)/14),h=n+(p>0?3.5*p**1.3:0)+(o<e.xs+6?1.2*(1-(o-e.xs)/6):0);for(let e=0;e<=28;e++){e<=14?14-e:e-14-1,(e<=14?14-e:e-14-1+0)/14;let t,n=e/28,r=n<=.5?n*2:(1-n)*2;t=n<.5?-1:1;let d=m+(h-m)*r,p=1-.42*r**2.4+.05*Math.sin(r*Math.PI),g=t*f*p*(n===.5?0:1);i.push(o,d,g);let _=d,v;v=_>2.35?s:_>2?u:_>.35?c:_>-.1?u:l,v=v.clone(),a.push(v.r,v.g,v.b)}}for(let e=0;e<90;e++)for(let t=0;t<28;t++){let n=e*29+t,r=n+1,i=n+29,a=i+1;o.push(n,i,r,r,i,a)}let f=new br;f.setAttribute(`position`,new W(i,3)),f.setAttribute(`color`,new W(a,3)),f.setIndex(o),f.computeVertexNormals();let p=new G(f,new go({vertexColors:!0,roughness:.5,metalness:.1,side:2}));return p.castShadow=!0,p.receiveShadow=!0,p}var Ld=class{constructor(e,t,n,r=0){this.b=e,this.x=t,this.z=n,this.ry=r,this.c=Math.cos(r),this.s=Math.sin(r)}w(e,t){return[this.x+e*this.c+t*this.s,this.z-e*this.s+t*this.c]}box(e,t,n,r,i,a,o=0){let[s,c]=this.w(t,n);this.b.box(e,s,c,r,i,a,o,this.ry)}boxc(e,t,n,r,i,a,o,s=0,c=0){let[l,u]=this.w(t,r);this.b.boxc(e,l,n,u,i,a,o,this.ry,s,c)}cyl(e,t,n,r,i,a=0,o=14,s=r){let[c,l]=this.w(t,n);this.b.cyl(e,c,l,r,i,a,o,s)}sph(e,t,n,r,i,a=1,o=1,s=1,c=10){let[l,u]=this.w(t,r);this.b.sph(e,l,n,u,i,a,o,s,c)}block(e,t,n,r){let[i,a]=this.w(e,t);this.b.blockC(i,a,n,r,this.ry)}},Rd=(e,t,n,r)=>new Ld(e,t,n,r);function zd(e,t,n,r,i=`fabricB`){let a=Rd(e,t,n,r);a.cyl(`steelDark`,0,0,.04,.3,.05,6),a.box(`steelDark`,0,0,.5,.06,.04,.03),a.box(i,0,0,.5,.5,.08,.4),a.box(i,0,-.24,.46,.08,.5,.5)}function Bd(e,t,n,r=1,i=`leaf`){e.cyl(`pot`,t,n,.22*r,.4*r,0,10,.17*r),e.sph(i,t,.75*r,n,.32*r,1,1.2,1),e.sph(`leaf2`,t+.12*r,1*r,n-.05*r,.22*r,1,1.1,1),e.block(t-.25*r,n-.25*r,t+.25*r,n+.25*r)}function Vd(e,t,n){e.cyl(`steelDark`,t,n,.14,.04,0,8),e.cyl(`steel`,t,n,.02,1.5,.04,6),e.cyl(`lamp`,t,n,.2,.28,1.45,10,.1)}function Hd(e,t,n,r=.8,i=`crate`,a=0,o=r){e.box(i,t,n,r,r,o,0,a),e.box(`woodDark`,t,n,r+.02,r+.02,.06,o*.3,a),e.blockC(t,n,r,r,a)}function Ud(e,t,n,r=`rust`){e.cyl(r,t,n,.32,.9,0,12),e.cyl(`steelDark`,t,n,.335,.05,.2,12),e.cyl(`steelDark`,t,n,.335,.05,.65,12),e.block(t-.33,n-.33,t+.33,n+.33)}function Wd(e,t,n,r,i=2.2,a=`sofa`){let o=Rd(e,t,n,r);o.box(a,0,0,i,.9,.42),o.box(a,0,-.38,i,.2,.45,.4),o.box(a,-i/2+.1,0,.2,.9,.3,.42),o.box(a,i/2-.1,0,.2,.9,.3,.42),o.block(0,0,i,.95)}function Gd(e,t,n,r,i=`sofa2`){Wd(e,t,n,r,.95,i)}function Kd(e,t,n,r=0,i=1.1,a=.6){let o=Rd(e,t,n,r);o.box(`woodDark`,0,0,i,a,.05,.38),o.box(`steelDark`,-i/2+.05,-a/2+.05,.04,.04,.38),o.box(`steelDark`,i/2-.05,a/2-.05,.04,.04,.38),o.box(`steelDark`,-i/2+.05,a/2-.05,.04,.04,.38),o.box(`steelDark`,i/2-.05,-a/2+.05,.04,.04,.38),o.block(0,0,i,a)}function qd(e,t,n,r,i=2,a=2){let o=Rd(e,t,n,r);o.box(`woodDark`,0,0,i,.4,a);let s=[`red`,`blue`,`yellow`,`green`,`orange`,`purple`,`pink`];for(let e=0;e<4;e++){let t=.25+e*(a-.3)/4.1;for(let n=0;n<Math.floor(i/.16);n++)o.box(s[(n*3+e*2)%s.length],-i/2+.12+n*.16,.06,.1,.26,.28+(n+e)%3*.04,t)}o.block(0,0,i,.42)}function Jd(e,t,n,r,i,a=0,o=`woodLight`,s=.74){let c=Rd(e,t,n,a);c.box(o,0,0,r,i,.06,s-.06);for(let e of[-1,1])for(let t of[-1,1])c.box(`steelDark`,e*(r/2-.08),t*(i/2-.08),.06,.06,s-.06);c.block(0,0,r,i)}function Yd(e,t,n,r=.6){e.cyl(`woodLight`,t,n,r,.05,.7,16),e.cyl(`steelDark`,t,n,.05,.7,0,8),e.cyl(`steelDark`,t,n,.28,.04,0,12),e.blockC(t,n,r*2,r*2)}function Xd(e,t,n,r=.65,i=`red`){e.cyl(i,t,n,.19,.07,r-.07,12),e.cyl(`steel`,t,n,.03,r-.07,0,6),e.cyl(`steelDark`,t,n,.18,.03,0,10)}function Zd(e,t,n,r,i=`wood`){let a=Rd(e,t,n,r);a.box(i,0,0,.42,.42,.05,.42),a.box(i,0,-.2,.42,.05,.45,.45);for(let e of[-1,1])for(let t of[-1,1])a.box(`steelDark`,e*.18,t*.18,.04,.04,.42)}function Qd(e,t,n,r,i={}){let a=e.b,o=Rd(a,t,n,r);o.box(`woodLight`,0,.95,1.7,.85,.05,.72),o.box(`steelDark`,-.78,.95,.05,.75,.72),o.box(`steelDark`,.78,.95,.05,.75,.72),o.box(`steelDark`,0,1.3,1.55,.04,.5,.2);let[s,c]=o.w(0,1.2);o.box(`black`,0,1.2,.7,.05,.42,.9),o.box(`black`,0,1.2,.08,.14,.04,.74);let l=new Zr({color:1714746}),u=new G(new Qa(.64,.36),l),[d,f]=o.w(0,1.17);return u.position.set(d,.97,f),u.rotation.y=r+Math.PI,e.group.add(u),o.box(`black`,0,.75,.5,.16,.02,.78),o.box(`white`,.55,.8,.08,.08,.08,.78),o.block(0,.95,1.8,.95),zd(a,t,n,r,i.chair||`fabricB`),{seat:{x:t+Math.sin(r)*0,z:n,face:r},screenMat:l}}function $d(e,t,n,r,i=`fabricB`){let a=Rd(e,t,n,r);a.box(`woodDark`,0,0,1.15,2.15,.28),a.box(`fabricW`,0,0,1.08,2.05,.2,.28),a.box(i,0,-.2,1.1,1.5,.1,.4),a.box(`fabricW`,0,.78,.7,.4,.12,.45),a.box(`woodDark`,0,1.1,1.2,.08,.7),a.block(0,0,1.2,2.2)}function ef(e,t,n,r=0){let i=Rd(e,t,n,r);i.box(`woodDark`,0,0,.45,.4,.5),i.cyl(`lamp`,0,0,.1,.18,.5,8,.06),i.block(0,0,.45,.4)}function tf(e,t,n,r=0){let i=Rd(e,t,n,r);i.box(`woodLight`,0,0,1.2,.55,1.9),i.box(`woodDark`,0,.28,.02,.02,1.8,.05),i.block(0,0,1.2,.55)}function nf(e,t,n,r){let i=Rd(e,t,n,r);i.box(`white`,0,0,.38,.25,.4,0),i.box(`white`,0,-.2,.32,.5,.2,0),i.box(`white`,0,.08,.38,.14,.4,.4),i.block(0,0,.4,.7)}function rf(e,t,n,r){let i=Rd(e,t,n,r);i.box(`white`,0,0,.5,.4,.1,.78),i.box(`white`,0,0,.1,.1,.78),i.box(`steel`,0,.12,.04,.04,.12,.88),i.block(0,0,.5,.4)}function af(e,t,n,r=1,i=1){e.box(`tile`,t,n,r,i,.04,0),e.boxc(`glass`,t-r/2,1.05,n,.03,2,i),e.boxc(`glass`,t,1.05,n+i/2,r,2,.03),e.cyl(`steel`,t+r/2-.1,n-i/2+.1,.02,1,1.4,6),e.sph(`steel`,t+r/2-.1,2.35,n-i/2+.1,.12,1,.3,1,8)}function of(e,t,n,r,i,a,o,s){let c=a*.5625,l=Rd(e.b,t,r,i);l.boxc(`black`,0,n,0,a+.1,c+.1,.1),l.box(`steelDark`,0,-.08,.5,.2,n-c/2-.02,0);let u=new G(new Qa(a,c),s?new Zr({map:s,toneMapped:!1}):o),[d,f]=l.w(0,.056);return u.position.set(d,n,f),u.rotation.y=i,e.group.add(u),e.tvs.push(u),u}function sf(e,t,n,r,i=`blue`){let a=e.b,o=Rd(a,t,n,r);o.box(i,0,0,.8,.7,1.7),o.box(`black`,0,.35,.7,.05,1,.4),o.box(`steelDark`,0,.45,.78,.4,.04,.95),o.box(`lamp`,0,.2,.82,.08,.6,1.62);let s=[16733559,5636010,6728447,16763972][Math.floor(Math.abs(t*7+n*3))%4],c=new Zr({color:s}),l=new G(new Qa(.62,.44),c),[u,d]=o.w(0,.37);l.position.set(u,1.18,d),l.rotation.set(-.3,r,0),l.rotation.order=`YXZ`,e.group.add(l),e.screens.push(c),o.block(0,0,.85,.8)}function cf(e,t,n,r){let i=Rd(e,t,n,r);i.box(`steelDark`,0,0,.7,1.6,.16),i.box(`black`,0,0,.58,1.5,.04,.16),i.box(`steel`,-.3,.75,.04,.04,1),i.box(`steel`,.3,.75,.04,.04,1),i.box(`black`,0,.78,.5,.14,.2,1),i.block(0,0,.75,1.65)}function lf(e,t,n,r){let i=Rd(e,t,n,r);i.box(`leather`,0,0,.35,1.2,.1,.4),i.box(`steelDark`,0,-.5,.06,.06,.4),i.box(`steelDark`,0,.5,.06,.06,.4),i.box(`steelDark`,-.5,.45,.05,.05,1.1),i.box(`steelDark`,.5,.45,.05,.05,1.1);let[a,o]=i.w(0,.45);e.cylc(`steel`,a,1.35,o,.015,1.5,6,0,r,Math.PI/2);for(let t of[-.62,.62]){let[n,a]=i.w(t,.45);e.cylc(`black`,n,1.35,a,.2,.06,14,0,r,Math.PI/2)}i.block(0,0,1.6,1.3)}function uf(e,t,n,r){let i=Rd(e,t,n,r);i.box(`steelDark`,0,0,2,.5,.6);for(let e=0;e<6;e++)i.box(`black`,-.8+e*.32,0,.18,.2,.14,.62),i.box(`steel`,-.8+e*.32,0,.1,.4,.04,.66);i.block(0,0,2,.5)}function df(e,t,n,r,i){let a=Math.abs(r-t)>Math.abs(i-n),o=(t+r)/2,s=(n+i)/2;a?e.boxc(`glassTint`,o,1.2,s,Math.abs(r-t),1.8,.05):e.boxc(`glassTint`,o,1.2,s,.05,1.8,Math.abs(i-n))}function ff(e,t,n,r){let i=Rd(e,t,n,r);i.box(`steel`,0,0,.9,2,.08,.45),i.box(`white`,0,0,.85,1.9,.14,.53),i.box(`white`,0,.8,.5,.3,.1,.67),i.box(`steelDark`,0,0,.05,.05,.45),i.block(0,0,.95,2.05)}function pf(e,t,n,r,i,a=1.7){let o=Math.abs(r-t)>Math.abs(i-n),s=(t+r)/2,c=(n+i)/2;o?(e.boxc(`fabricW`,s,.9+a/2-.4,c,Math.abs(r-t),a-0,.03),e.block(t,n-.08,r,i+.08)):(e.boxc(`fabricW`,s,.9+a/2-.4,c,.03,a,Math.abs(i-n)),e.block(t-.08,n,r+.08,i))}function mf(e,t,n,r){let i=Rd(e,t,n,r);i.box(`white`,0,0,.9,.4,1.7),i.box(`red`,0,.21,.35,.02,1.2,.5),i.box(`red`,0,.211,.1,.02,1.2,.8),i.block(0,0,.9,.42)}function hf(e,t,n,r){let i=Rd(e,t,n,r);i.box(`courtBlue`,0,0,2.74,1.525,.04,.72),i.box(`courtLine`,0,0,2.74,.015,.045,.72),i.box(`courtLine`,0,0,.015,1.525,.045,.72);for(let e of[-1,1])for(let t of[-1,1])i.box(`steelDark`,e*1.2,t*.6,.06,.06,.72);i.box(`white`,0,0,.012,1.7,.15,.76),i.box(`steelDark`,0,.85,.03,.03,.17,.76),i.box(`steelDark`,0,-.85,.03,.03,.17,.76),i.block(0,0,2.8,1.55)}function gf(e,t,n){e.box(`courtBlue`,t,n,14.4,7.2,.03,0),e.box(`courtGreen`,t,n,13.4,6.1,.015,.03);let r=(r,i,a,o)=>e.box(`courtLine`,t+r,n+i,a,o,.012,.045);r(0,3.05,13.4,.05),r(0,-3.05,13.4,.05),r(6.7,0,.05,6.1),r(-6.7,0,.05,6.1),r(2.13,0,.05,6.1),r(-2.13,0,.05,6.1),r(3.4,0,4.3,.05),r(-3.4,0,4.3,.05),e.box(`white`,t,n,.03,6.7,.9,0),e.box(`black`,t,n,.04,6.7,.06,.88),e.box(`steelDark`,t,n+3.35,.06,.06,.95),e.box(`steelDark`,t,n-3.35,.06,.06,.95),e.block(t-.03,n-3.4,t+.03,n+3.4)}function _f(e,t,n,r=12,i=9){e.box(`courtBlue`,t,n,r+1,i+1,.03,0),e.box(`rubber`,t,n,r,i,.015,.03);let a=(r,i,a,o)=>e.box(`courtLine`,t+r,n+i,a,o,.012,.045);a(0,i/2,r,.06),a(0,-i/2,r,.06),a(r/2,0,.06,i),a(-r/2,0,.06,i),a(0,0,.06,i),new Mi(1.8,1.8,.012,24,1,!0),e.add(e.M.courtLine,Dd(new $a(1.6,1.66,32).rotateX(-Math.PI/2),t,.05,n));for(let i of[-1,1]){a(i*(r/2-2.4),0,.06,3.6),a(i*(r/2-1.2),1.8,2.4,.06),a(i*(r/2-1.2),-1.8,2.4,.06);let o=t+i*(r/2-.2);e.cyl(`steelDark`,o+i*.4,n,.07,3.2,0,8),e.box(`white`,o+i*.18,n,.04,1.4,.95,2.9),e.box(`red`,o+i*.14,n,.03,.55,.45,3),e.add(e.M.orange,Dd(new ro(.23,.02,6,16),o-i*.2,3.05,n,Math.PI/2,0,0)),e.block(o+i*.3-.12,n-.12,o+i*.5+.12,n+.12)}}function vf(e,t,n,r,i=`fabricW`){let a=Rd(e,t,n,r);a.box(`steel`,0,0,.7,1.9,.05,.28),a.box(i,0,0,.62,1.1,.1,.33),a.boxc(i,0,.62,-.7,.62,.1,.8,-.8),a.block(0,0,.75,1.95)}function yf(e,t,n,r=1.5,i=`sunshade`){e.cyl(`steel`,t,n,.03,2.3,0,6),e.geo(i,Dd(new Ni(r,.45,10),t,2.35,n)),e.blockC(t,n,.2,.2)}function bf(e,t,n,r,i){e.add(e.M.red,Dd(new ro(.32,.09,8,16),t,n,r,0,i,0)),e.add(e.M.white,Dd(new ro(.32,.092,8,4),t,n,r,0,i,0,1,1,1))}function xf(e,t,n,r,i,a=1,o=.7,s=`woodDark`,c=`tile`){let l=Math.abs(r-t)>=Math.abs(i-n),u=(t+r)/2,d=(n+i)/2,f=Math.hypot(r-t,i-n);l?(e.box(s,u,d,f,o,a-.05),e.box(c,u,d,f+.05,o+.1,.06,a-.05),e.block(t,d-o/2,r,d+o/2)):(e.box(s,u,d,o,f,a-.05),e.box(c,u,d,o+.1,f+.05,.06,a-.05),e.block(u-o/2,n,u+o/2,i))}function Sf(e,t,n,r){let i=Rd(e,t,n,r);i.box(`steel`,0,0,.8,.7,1.8),i.box(`steelDark`,.3,.36,.03,.03,.6,.9),i.block(0,0,.8,.7)}function Cf(e,t,n,r){let i=Rd(e,t,n,r);i.box(`steel`,0,0,.9,.7,.9),i.box(`black`,0,0,.85,.65,.03,.9);for(let e of[-.2,.2])for(let t of[-.15,.15])i.cyl(`steelDark`,e,t,.1,.02,.93,10);i.block(0,0,.9,.7)}function wf(e,t,n,r,i=`cargoBlue`,a=4.8){let o=Rd(e,t,n,r);o.box(i,0,0,a,2,2.2);for(let e=-a/2+.2;e<a/2;e+=.34)o.box(i,e,1.02,.1,.06,2,0),o.box(i,e,-1.02,.1,.06,2,0);o.block(0,0,a,2.05)}function Tf(e,t,n,r,i=2.4){let a=Rd(e,t,n,r);for(let e of[-i/2,i/2])a.box(`steelDark`,e,0,.06,.5,2.1);for(let e=0;e<4;e++)a.box(`steel`,0,0,i,.5,.04,.2+e*.6),e<3&&(a.box([`cargoBlue`,`crate`,`cargoRed`][e%3],-.5,0,.5,.35,.3,.24+e*.6),a.box(`crate`,.5,0,.55,.35,.35,.24+e*.6));a.block(0,0,i,.5)}function Ef(e,t,n,r=0){let i=Rd(e,t,n,r);i.box(`white`,0,0,.4,.4,1),i.cyl(`lightblue`,0,0,.16,.45,1,10),i.block(0,0,.4,.4)}function Df(e,t,n,r=0){let i=Rd(e,t,n,r);i.box(`woodDark`,0,0,.9,.5,.95),i.box(`steelDark`,0,0,.5,.4,.45,.95),i.box(`red`,0,.18,.12,.04,.12,1.15),i.block(0,0,.9,.5)}function Of(e,t,n,r,i=2.6){let a=Rd(e,t,n,r);a.box(`steel`,0,0,i+.1,.05,1.3,.55),a.box(`white`,0,.03,i,.02,1.2,.6),a.box(`blue`,-.5,.045,.9,.01,.03,1.2),a.box(`red`,.3,.045,.7,.01,.03,1),a.box(`green`,0,.045,.6,.01,.03,.95),a.block(0,0,i,.1)}function kf(e,t,n,r=2.1){let i=e.b;i.cyl(`woodDark`,t,n,r+.3,.9,0,24),i.cyl(`white`,t,n,r,.92,0,24);let a=new G(new ji(r-.12,28).rotateX(-Math.PI/2),e.M.water);a.position.set(t,.86,n),a.receiveShadow=!0,e.group.add(a),e.waters.push(a),i.blockC(t,n,(r+.3)*2,(r+.3)*2)}function Af(e,t,n,r,i){let a=e.b,o=(t+r)/2,s=(n+i)/2,c=r-t,l=i-n,u=.55,d=.45;a.box(`tile`,o,n-u/2,c+u*2,u,d),a.box(`tile`,o,i+u/2,c+u*2,u,d),a.box(`tile`,t-u/2,s,u,l,d),a.box(`tile`,r+u/2,s,u,l,d),a.box(`tileBlue`,o,s,c,l,.02,0);let f=new G(new Qa(c,l).rotateX(-Math.PI/2),e.M.water);f.position.set(o,.34,s),e.group.add(f),e.waters.push(f),a.block(t-u,n-u,r+u,i+u),a.cyl(`steel`,t+1.4,i+.1,.03,1,.3,6),a.cyl(`steel`,t+1.9,i+.1,.03,1,.3,6)}function jf(e,t,n){let r=e.b;r.box(`steelDark`,t,n,2.2,2.2,.15,4.4);for(let e of[-1,1])for(let i of[-1,1])r.cyl(`steel`,t+e*1,n+i*1,.07,4.4,0,8);r.box(`white`,t,n,1,.6,4.4,0);for(let e=0;e<8;e++)r.box(`steel`,t+1.3+e%2*0,n-1+e*.28,.5,.05,.05,.4+e*.5);r.blockC(t,n,2.6,2.6);let i=[[0,4.9,0],[1.9,4.6,-2.3],[4.6,4,-3.4],[8,3.3,-2.9],[10.4,2.5,0],[8.6,1.8,3],[6,1.3,1.6],[7.6,.6,-.2]].map(([e,r,i])=>new V(t+e,r,n+i)),a=new Ui(i,!1,`catmullrom`,.5),o=new io(a,120,.55,10,!1);r.add(r.M.orange,o);for(let e=3;e<i.length-1;e++){let t=a.getPoint(e/(i.length-1));r.cyl(`steel`,t.x,t.z,.05,t.y-.4,0,6)}}function Mf(e,t,n){let r=new vn,i=e.M,a=(e,t,n=[0,0,0],i=[0,0,0])=>{let a=new G(e,t);return a.position.set(...n),a.rotation.set(...i),a.castShadow=!0,r.add(a),a};a(new no(1,16,12).scale(1.5,.95,.95),i.heliBody,[0,1.25,0]),a(new K(2.8,.14,.14),i.heliRed,[0,1.25,.96]),a(new no(.8,12,8).scale(1,.75,.8),i.glassTint,[.95,1.3,0]),a(new Mi(.1,.22,3.2,8),i.heliBody,[-2.7,1.45,0],[0,0,Math.PI/2+.05]),a(new K(.1,.9,.08),i.heliRed,[-4.2,1.8,0]);for(let e of[-1,1])a(new Mi(.04,.04,2.8,6),i.steelDark,[0,.12,e*.75],[0,0,Math.PI/2]),a(new Mi(.04,.04,.6,6),i.steelDark,[.7,.4,e*.7]),a(new Mi(.04,.04,.6,6),i.steelDark,[-.7,.4,e*.7]);a(new Mi(.06,.06,.4,6),i.steelDark,[0,2.25,0]);let o=new vn;o.position.set(0,2.45,0),r.add(o);for(let e=0;e<2;e++){let t=new G(new K(5.8,.03,.22),i.steelDark);t.rotation.y=e*Math.PI/2,o.add(t)}let s=new vn;return s.position.set(-4.2,1.8,.1),r.add(s),s.add(new G(new K(.04,.9,.08),i.steelDark)),r.position.set(t,0,n),r.rotation.y=0,e.group.add(r),e.rotors.push({obj:o,speed:14,axis:`y`},{obj:s,speed:20,axis:`z`}),e.b.blockC(t,n,3.4,2),r}var Nf=(e,t,n,r)=>Math.atan2(n-e,r-t),Y=Math.PI;function Pf(e,t,n,r,i,a,o=1.3,s=.34,c=0){let l=document.createElement(`canvas`);l.width=256,l.height=Math.round(256*s/o);let u=l.getContext(`2d`);u.fillStyle=`#1b2a3a`,u.fillRect(0,0,l.width,l.height),u.strokeStyle=`#d8b25a`,u.lineWidth=5,u.strokeRect(3,3,l.width-6,l.height-6),u.fillStyle=`#ffe9b0`,u.font=`bold ${Math.round(l.height*.5)}px "Noto Sans TC","Microsoft JhengHei",sans-serif`,u.textAlign=`center`,u.textBaseline=`middle`,u.fillText(t,l.width/2,l.height/2+2);let d=new Ei(l);d.colorSpace=Je,d.anisotropy=4;let f=new G(new Qa(o,s),new Zr({map:d,toneMapped:!1}));return f.position.set(n,r,i),f.rotation.set(c,a,0),f.rotation.order=`YXZ`,e.group.add(f),f}function Ff(e,t,n,r,i,a,o,s,c=`#12202e`,l=`#ffcf6a`){let u=document.createElement(`canvas`);u.width=512,u.height=Math.round(512*s/o);let d=u.getContext(`2d`);d.fillStyle=c,d.fillRect(0,0,u.width,u.height),d.strokeStyle=l,d.lineWidth=6,d.strokeRect(5,5,u.width-10,u.height-10),d.fillStyle=l,d.font=`bold ${Math.round(u.height*.56)}px "Noto Sans TC","Microsoft JhengHei",sans-serif`,d.textAlign=`center`,d.textBaseline=`middle`,d.fillText(t,u.width/2,u.height/2+3);let f=new Ei(u);f.colorSpace=Je,f.anisotropy=4;let p=new G(new Qa(o,s),new Zr({map:f,toneMapped:!1}));return p.position.set(n,r,i),p.rotation.y=a,e.group.add(p),p}var If=(e,t,n,r,i,a,o=.02)=>e.b.box(t,(n+i)/2,(r+a)/2,i-n,a-r,o,0);function Lf(e,t,n,r,i,a=[],o=1.05,s=2.3){e.b.wall(t,n,r,i,o,`white`,.16,a),e.b.wall(t,n,r,i,s-o,`glass`,.05,a,o)}var X=(e,t,n)=>{var r;return((r=e.pois.misc)[t]||(r[t]=[])).push(n),n};function Rf(e,t,n,r,i,a=1.1,o=2.1){let s=new vn;s.position.set(t,0,n),s.rotation.y=i,e.group.add(s);let c=new G(new K(.05,o,a),e.M.woodLight);c.position.set(0,o/2,a/2),c.castShadow=!0,s.add(c);let l=new G(new K(.09,.05,.12),e.M.steel);l.position.set(0,1,a-.14),s.add(l);let u={pivot:s,closedYaw:r,openYaw:i,cur:i,target:i,speed:3.5};return u.set=e=>{u.target=e?i:r},u.closed=()=>Math.abs(u.cur-r)<.05,u.opened=()=>Math.abs(u.cur-i)<.05,e.dyn.push(e=>{let t=u.target-u.cur;Math.abs(t)>.001&&(u.cur+=Math.sign(t)*Math.min(Math.abs(t),u.speed*e),s.rotation.y=u.cur)}),u}function zf(e,t){let n=e.b;If(e,`tileDark`,-44.4,-9.5,-34,9.5),If(e,`tile`,-34,-9.5,-14,9.5),If(e,`carpet`,-14,-1.4,10,1.4),Lf(e,-44.4,-9.5,10,-9.5),Lf(e,-44.4,9.5,10,9.5),n.wall(-44.4,-9.5,-44.4,9.5,1.3,`white`,.2),n.wall(-34,-9.5,-34,9.5,1.2,`white`,.16,[[-1.1,1.1]]);for(let[e,t,r,i]of[[-41,-6.6,0,`cargoBlue`],[-41,6.6,0,`cargoRed`],[-37,7.4,0,`cargoGreen`]])wf(n,e,t,r,i,i===`cargoGreen`?3:4.8);Tf(n,-43.6,-2.2,Y/2,2.4),Tf(n,-43.6,2.2,Y/2,2.4),[[-38,-2.6],[-38.8,-1.8],[-38,-.8],[-36.4,-7.6],[-36.4,-6.6]].forEach(([e,t],r)=>Hd(n,e,t,.8+r%2*.2,`crate`,r*.3)),[[-35.2,-4.5],[-35.2,-3.7],[-35.6,3.5],[-36.4,4.2]].forEach(([e,t],r)=>Ud(n,e,t,r%2?`cargoBlue`:`rust`)),Ff(e,`儲藏室`,-34.12,1.95,0,Y/2*3-Y,1.6,.4),xf(n,-33.6,-8.5,-33.6,-2,.95),xf(n,-33.6,2,-33.6,8.5,.95),Sf(n,-33.3,-1.2,Y/2*3-Y+Y),Cf(n,-33.3,1.2,Y/2),xf(n,-30.6,-6.5,-30.6,6.5,1.05,.5,`woodDark`,`woodLight`),n.blocks.pop(),n.block(-30.9,-6.5,-30.3,-1.2),n.block(-30.9,1.2,-30.3,6.5);for(let e=0;e<4;e++)n.sph(`steel`,-33.4,1.2,-7.5+e*1,0,1,1,1,4);e.steams.push({x:-33.3,y:1.1,z:1.2,s:.6});let r=[];for(let[e,t]of[[-25.5,-5.5],[-25.5,5.5],[-19.5,-5.5],[-19.5,5.5]]){Jd(n,e,t,2.4,1,0,`woodLight`);for(let i of[-.65,.65])for(let a of[-1,1]){let o=t+a*.95;Zd(n,e+i,o,Nf(e+i,o,e+i,t),`wood`),r.push({x:e+i,z:o,face:Nf(e+i,o,e+i,t)})}n.cylc(`white`,e-.4,.8,t,.12,.05,10),n.cylc(`orange`,e+.5,.78,t+.15,.16,.03,12)}r.forEach(t=>X(e,`canteen`,t)),n.wall(-14,-9.5,-14,9.5,1.2,`white`,.16,[[-1.1,1.1]]),Ff(e,`餐廳 · 廚房`,-14.12,1.95,0,-Y/2,2,.42),Bd(n,-15,-8.4,1),Bd(n,-15,8.4,1),Vd(n,-31.5,8.6);let i=[`最高級打工仔`,`交易員-1`,`交易員-2`,`0xcat`,`策略研究員`,`鏈上獵手`],a=[-14,-6,2];n.wall(10,-9.5,10,-1.4,1.2,`white`,.16),n.wall(10,1.4,10,9.5,1.2,`white`,.16);let o=0;for(let t of[-1,1])for(let r=0;r<3;r++){let s=i[o++],c=a[r],l=e=>c+e,u=e=>t*(1.5+e);If(e,(r+ +(t>0))%2?`woodLight`:`wood`,c+.05,Math.min(u(0),u(8)),c+7.95,Math.max(u(0),u(8))),n.wall(c,u(0),c,u(8),1.2,`white`,.16),n.wall(c,t*1.5,c+8,t*1.5,1.2,`white`,.14,[[c+2,c+3.5]]);let d=l(5.2),f=l(8);n.wall(d,t*1.5,f,t*1.5,2.3,`white`,.18),n.wall(d,u(3.2),f,u(3.2),2.3,`white`,.14),n.wall(d,u(0),d,u(3.2),2.3,`white`,.14,[[Math.min(u(.9),u(2.1)),Math.max(u(.9),u(2.1))]]),If(e,`tile`,d,Math.min(u(0),u(3.2)),f,Math.max(u(0),u(3.2)),.03),af(n,l(7.4),u(.75),1,1),nf(n,l(6),u(.5),t>0?Y:0),rf(n,l(7.55),u(2.6),t>0?Y/2*3-Y+Y:0);let p=[l(5.2),u(.9)],m=t>0?0:Y,h=t>0?-Y/2:Y/2,g=Rf(e,p[0],p[1],m,h,1.2);g.set(!0),g.cur=g.target=h,g.pivot.rotation.y=h;let _=u(6.2);$d(n,l(2.2),_,t>0?0:Y,[`fabricB`,`fabricP`,`fabricG`,`fabricY`,`fabricB`,`fabricP`][o-1]),ef(n,l(3.4),u(7.3),t>0?Y:0),tf(n,l(.45),u(2.6),t>0?Y/2:-Y/2),n.box(`rug`,l(3.8),u(3.9),2.2,1.5,.02,.02);let v=Qd(e,l(6.6),u(6.5),t>0?0:Y,{chair:`fabricW`});Pf(e,s,l(2.75),1.45,t*1.38,t>0?Y:0,1.5,.3),Vd(n,l(.5),u(7.4)),e.cabinWin=!0,l(2.2),u(6.2);let y={title:s,bed:{x:l(2.2),z:u(6.3),face:t>0?Y:0,headYaw:t>0?0:Y,y:.6,headDir:[0,t]},door:{x:l(2.75),z:u(1)},corridor:{x:l(2.75),z:0},bathOut:{x:l(4.4),z:u(1.5),face:Y/2},bathIn:{x:l(6.9),z:u(1.9)},bathDoor:g,bathDoorPt:{x:l(5.2),z:u(1.5)},steam:{x:l(6.6),y:2,z:u(1.6)},deskSeat:{x:v.seat.x,z:v.seat.z,face:v.seat.face},side:t};e.pois.cabins[s]=y,e.steams.push({x:l(6.6),y:2.3,z:u(1.6),s:1,cabin:s})}If(e,`wood`,24,-9,44,9,.02);for(let t of[-7,-4.5,4.5,7]){n.box(`woodDark`,30,t,5,1.1,.5),n.box(`soil`in e.M?`soil`:`woodDark`,30,t,4.8,.9,.05,.5);for(let e=0;e<6;e++)n.sph(`leaf`,27.9+e*.8,.8,t+(e*7%3-1)*.1,.22,1,1.1,1);n.block(27.5,t-.55,32.5,t+.55)}for(let[e,t]of[[38,-5],[38,5],[41,0]])n.cyl(`steel`,e,t,1.1,2.4,0,16),n.cyl(`steelDark`,e,t,1.15,.15,2.4,16),n.cyl(`lightblue`,e,t,.5,.06,2.55,12),n.blockC(e,t,2.4,2.4);Ff(e,`（未來）淨水 · 農場區`,36,2.7,0,-Y/2,3.2,.5);for(let e of[-1,1])for(let t of[-20,4]){let r=e*11.6;n.sph(`orange`,t,1.2,r,1.8,1,.55,.62,12),n.box(`white`,t,r,3,.5,.12,1.55),n.blockC(t,r,3.5,2.2)}for(let t of[-1,1])for(let r of[-30,-8,18,36])bf(n,r,.7,t*(e.hw(r)-.25),t>0?0:Y);Bd(n,12,-8.5,1.1),Bd(n,12,8.5,1.1),Vd(n,20,8.6),Vd(n,20,-8.6),X(e,`chat`,{x:12,z:0}),X(e,`chat`,{x:-22,z:0}),X(e,`rail`,{x:48,z:0,face:0}),n.box(`steelDark`,51,0,.3,.3,4),n.box(`steelDark`,51,0,.2,5,.2,4)}function Bf(e,t){let n=e.b,r=(e,t,n)=>{new ua;let r=[],i=(e,t,i)=>{for(let a=0;a<=8;a++){let o=i+a/8*Y/2;r.push([e+Math.cos(o)*n,t+Math.sin(o)*n])}};return i(e-n,t-n,0),i(-e+n,t-n,Y/2),i(-e+n,-t+n,Y),i(e-n,-t+n,Y*1.5),r},i=r(36,10.95,4),a=r(33.8,8.75,2.2),o=new ua(i.map(([e,t])=>new B(e,-t)));o.holes.push(new la(a.map(([e,t])=>new B(e,-t)).reverse()));let s=new eo(o);s.rotateX(-Y/2),n.add(e.M.rubber,Dd(s,0,.025,0));for(let e of[.55,1.1,1.65])r(36,10.95,4);let c=e=>r(36-e*.55,10.95-e*.55,Math.max(4-e*.55,1));for(let t of[0,1,2,3]){let r=c(t+.02),i=c(t+.12),a=new ua(r.map(([e,t])=>new B(e,-t)));a.holes.push(new la(i.map(([e,t])=>new B(e,-t)).reverse()));let o=new eo(a);o.rotateX(-Y/2),n.add(e.M.courtLine,Dd(o,0,.032,0))}let l=r(34.9,9.85,3.1);e.pois.track=l.map(([e,t])=>({x:e,z:t})),If(e,`tileDark`,-33.8,-8.8,-22,8.8,.025),Lf(e,-22,-8.8,-22,8.8,[[.2,1.8]]),Lf(e,-33.8,-8.8,-22,-8.8,[]),Lf(e,-33.8,8.8,-22,8.8,[]);for(let t of[-6.8,-4.6,-2.4,-.2])cf(n,-31.2,t,Y/2),X(e,`treadmill`,{x:-31.9,z:t,face:Y/2});for(let t of[3.2,5.2])cf(n,-31.2,t,Y/2),X(e,`treadmill`,{x:-31.9,z:t,face:Y/2});lf(n,-26.5,6,0),lf(n,-26.5,2.8,0),uf(n,-24.2,8.2,Y),uf(n,-28.2,-8.2,0),X(e,`bench`,{x:-26.5,z:6,face:0}),X(e,`bench`,{x:-26.5,z:2.8,face:0}),df(n,-33.7,-4,-33.7,4),Ff(e,`健身房`,-21.9,2.15,-3,Y/2,1.8,.42),If(e,`tile`,-21.2,-8.8,-14,-.4,.025),Lf(e,-21.2,-8.8,-21.2,-.4,[[-3.8,-2.2]]),Lf(e,-21.2,-.4,-14,-.4,[[-17.4,-15.6]]),Lf(e,-14,-8.8,-14,-.4,[[-5.6,-4]]),ff(n,-19.6,-6,0),ff(n,-16.2,-6,0),pf(n,-17.9,-8,-17.9,-4,1.5),mf(n,-14.6,-8.3,Y/2*3-Y),n.box(`red`,-14.05,-3,.04,.9,.3,1.6),n.box(`red`,-14.05,-3,.04,.3,.9,1.3),Ff(e,`醫務室`,-14.2,2.2,-4.8,-Y/2,1.5,.4,`#3a0f0f`,`#ffd0d0`),X(e,`infirm`,{x:-19.6,z:-6,face:0}),gf(n,-6,0),e.pois.pickle={a:{x:-9.6,z:.9,face:Y/2},b:{x:-2.4,z:-.9,face:-Y/2},net:{x:-6,z:0},wallY:0};for(let[t,r]of[[-9.5,7.2],[-3.5,7.2],[-6.5,-7.2]])hf(n,t,r,0),X(e,`pingpong`,{a:{x:t-1.95,z:r,face:Y/2},b:{x:t+1.95,z:r,face:-Y/2},c:{x:t,z:r}});_f(n,28.8,0,10,9),e.pois.misc.hoop=[{x:27,z:.3,face:Y/2,hoop:{x:33.4,y:3.05,z:0}}],Ef(n,9,8.2),Kd(n,7.2,8.2,0,1.8,.5),X(e,`chat`,{x:7,z:6.4}),X(e,`cooler`,{x:9,z:7.4,face:Y}),Bd(n,2.5,8.4,1),Bd(n,2.5,-8.4,1),Vd(n,24,8.4),Vd(n,24,-8.4),X(e,`rail`,{x:8,z:10.6,face:0}),X(e,`rail`,{x:-8,z:-10.6,face:Y}),bf(n,0,.7,-11.75,Y),bf(n,14,.7,11.75,0)}function Vf(e,t){let n=e.b;If(e,`carpet`,-32.5,-9.2,7,9.2,.02);let r=Qd(e,-25,-1.6,0,{chair:`fabricB`}),i=Qd(e,-25,1.6,Y,{chair:`fabricP`});e.pois.desks.push({key:`交易員-1`,...r.seat,screen:r.screenMat},{key:`交易員-2`,...i.seat,screen:i.screenMat});for(let[t,n]of[[`策略研究員`,-18.5],[`最高級打工仔`,-13.5],[`0xcat`,-8.5],[`鏈上獵手`,-3.5]]){let r=Qd(e,n,-7.9,0,{chair:t===`最高級打工仔`?`leather`:`fabricG`});e.pois.desks.push({key:t,...r.seat,screen:r.screenMat})}e.pois.extraDesks=[];for(let t of[-18.5,-13.5,-8.5]){let n=Qd(e,t,7.9,Y,{chair:`fabricW`});e.screens.push(n.screenMat),n.screenMat.color.set(659480),e.pois.extraDesks.push({key:`x`+t,...n.seat,screen:n.screenMat})}Bd(n,-28.5,-8.6,1.1),Bd(n,5.8,-8.6,1.2),Bd(n,5.8,8.6,1.2),Bd(n,-31.5,8.6,1.1),Of(n,-33.55,0,Y/2,3),X(e,`whiteboard`,{x:-32.3,z:0,face:-Y/2}),Df(n,-31.3,-8.9,0),X(e,`coffee`,{x:-31.3,z:-7.9,face:Y}),Ef(n,-29.6,-9,0),X(e,`cooler`,{x:-29.6,z:-8,face:Y}),Wd(n,1.5,7.3,Y,2.4),Gd(n,4.4,5.6,-Y/2),Kd(n,1.6,5.6,0,1.3,.6),X(e,`chat`,{x:1.5,z:4.4}),X(e,`chat`,{x:-19,z:0}),X(e,`chat`,{x:-4,z:.5}),n.box(`rug`,2.4,6,4.2,2.6,.015,.02),Ff(e,`競技場 · 交易員 vs 交易員`,-33.7,2.45,-5,Y/2,4.2,.55),If(e,`carpet2`,26,-5.5,37.5,5.5,.02),Lf(e,26,-5.5,37.5,-5.5,[]),Lf(e,26,5.5,37.5,5.5,[]),n.wall(26,-5.5,26,5.5,2,`white`,.2,[[2.2,3.8]]),n.wall(37.6,-4.8,37.6,4.8,1.2,`white`,.1),Jd(n,31.8,0,5.4,1.8,0,`woodDark`);for(let e of[29.6,31,32.6,34])for(let t of[-1,1])Zd(n,e,t*1.6,t>0?Y:0,`leather`);Zd(n,35.3,0,-Y/2,`leather`),X(e,`meeting`,{x:29,z:0,face:Y/2}),of(e,26.2,1.55,0,Y/2,3.4,null,t.tvTex),e.tvs[e.tvs.length-1].position.x=26.25,Ff(e,`會議室`,25.88,2.45,-2.6,-Y/2,1.6,.42),Bd(n,36.6,-4.6,1),Bd(n,36.6,4.6,1),X(e,`rail`,{x:14,z:9.4,face:0}),X(e,`rail`,{x:14,z:-9.4,face:Y}),bf(n,0,.7,10.2,0),bf(n,-22,.7,-10.2,Y)}function Hf(e,t){let n=e.b;Af(e,-20,-4.5,-9,4.5),If(e,`tile`,-21.2,-5.7,-7.8,5.7,.02),jf(e,-24.9,0);for(let t of[-21,-18,-15,-12])vf(n,t,-7,0,`fabricW`),X(e,`lounger`,{x:t,z:-7,face:0,head:[0,-1]});for(let e of[-19.5,-13.5])yf(n,e,-8.2,1.7);vf(n,-6.5,3,Y/2,`fabricB`),X(e,`lounger`,{x:-6.5,z:3,face:Y/2,head:[-1,0]}),vf(n,-6.5,-1,Y/2,`fabricB`),X(e,`lounger`,{x:-6.5,z:-1,face:Y/2,head:[-1,0]}),yf(n,-5.6,1,1.8);for(let[e,t]of[[-23.4,5.4],[-23.4,-5.4]])Bd(n,e,t,1.1);X(e,`pool`,{x:-10.6,z:5.8,face:Y}),X(e,`pool`,{x:-17,z:-5.9,face:0}),X(e,`pool`,{x:-9,z:0,face:-Y/2}),If(e,`carpet`,-3.5,-8.7,8,-2,.02);let r=[`blue`,`red`,`green`,`purple`,`orange`,`blue`,`pink`];for(let t=0;t<7;t++){let n=-2.6+t*1.5;sf(e,n,-8.2,0,r[t]),X(e,`arcade`,{x:n,z:-7,face:Y})}sf(e,2,-3.5,Y,`purple`),X(e,`arcade`,{x:2,z:-4.7,face:0}),If(e,`woodDark`,-3.5,2.5,8,8.7,.02),xf(n,-2.5,6,7,6,1.05,.7,`woodDark`,`woodLight`),n.box(`woodDark`,2.2,8.5,9,.35,1.9);for(let e=0;e<9;e++)n.cyl([`green`,`orange`,`blue`,`red`][e%4],-2+e*1,8.3,.07,.3,1.1+e%3*.35,8);n.box(`lamp`,2.2,8.31,8.8,.04,.05,2.3);for(let t=0;t<6;t++){let r=-1.8+t*1.7;Xd(n,r,5,.7,`red`),X(e,`stool`,{x:r,z:5,face:0,bar:{x:r,z:6}})}Ff(e,`BAR · 方舟酒吧`,2.2,3,8.56,Y,3.4,.55,`#220a18`,`#ff7fb0`),X(e,`chat`,{x:4,z:3.3}),X(e,`chat`,{x:-14,z:0});for(let[e,t]of[[27,3.5],[27,-3.5]])vf(n,e,t,Y/2*3-Y+Y/2,`fabricY`),Jd(n,28.6,t,.6,.6,0,`woodLight`,.5);yf(n,28.6,0,2),Yd?.(n,28.6,0,.7),X(e,`lounger`,{x:27,z:3.5,face:Y*1.5,head:[-1,0]}),X(e,`lounger`,{x:27,z:-3.5,face:Y*1.5,head:[-1,0]}),X(e,`rail`,{x:30,z:4.2,face:Y/2}),X(e,`rail`,{x:30,z:-4.2,face:Y/2}),Vd(n,8.5,7.8),Vd(n,8.5,-7.8),bf(n,0,.7,8.85,0),bf(n,0,.7,-8.85,Y)}function Uf(e,t){let n=e.b;n.cyl(`asphalt`,-14.5,0,5.6,.1,0,36),n.add(e.M.yellow,Dd(new $a(5,5.2,48).rotateX(-Y/2),-14.5,.11,0)),n.box(`courtLine`,-14.5,-0,.4,3,.02,.11),n.box(`courtLine`,-14.5,0,.4,3,.02,.11,Y/2),n.box(`courtLine`,-14.5,0,2.2,.4,.02,.11),n.box(`courtLine`,-16.2,0,.4,3,.02,.11),n.box(`courtLine`,-12.8,0,.4,3,.02,.11),Mf(e,-14.5,0),e.pois.misc.heli=[{x:-9.2,z:2.6}],If(e,`carpet2`,-5.6,-6.6,9,6.6,.02),Lf(e,-5.6,-6.6,9,-6.6,[]),Lf(e,-5.6,6.6,9,6.6,[]),n.wall(-5.6,-6.6,-5.6,6.6,2.4,`white`,.2,[[4.6,6]]),n.wall(9,-6.6,9,6.6,1.1,`white`,.16,[[-1.4,1.4]]),n.wall(9,-6.6,9,6.6,1.2,`glass`,.05,[[-1.4,1.4]],1.1),of(e,-5.5,1.75,0,Y/2,3.6,null,t.tvTex),e.tvs[e.tvs.length-1].position.x=-5.4+.06;let r=Qd(e,3.6,0,-Y/2,{chair:`leather`});e.pois.desks.push({key:`T董`,...r.seat,screen:r.screenMat}),n.box(`woodDark`,2.55,0,.9,2.6,.1,.72),Wd(n,6.5,-4.8,-Y/2,2.4,`sofa2`),Wd(n,6.5,4.8,-Y/2,2.4,`sofa2`),Kd(n,4.9,0,Y/2,1.4,.7),n.box(`rug`,5.5,0,3.2,8.4,.015,.02),qd(n,-2,-6.35,0,2.2,2.1),qd(n,1.2,-6.35,0,2.2,2.1),qd(n,-2,6.35,Y,2.2,2.1),qd(n,1.2,6.35,Y,2.2,2.1),Bd(n,-4.6,-5.6,1.2),Bd(n,-4.6,5,1.2),Bd(n,8,-5.8,1.1),Vd(n,8.2,5.8),n.sph(`blue`,8,1.1,5,0,1,1,1,4),n.cyl(`woodDark`,4.4,-5.6,.2,.9,0,10),n.sph(`lightblue`,4.4,1.3,-5.6,.34,1,1,1,14),n.block(4.1,-5.9,4.7,-5.3),Ff(e,`T 董 辦 公 室`,9.12,2.55,0,Y/2,4,.5),X(e,`chat`,{x:7.6,z:0}),kf(e,15.8,4.6,2),X(e,`tub`,{x:15.8,z:4.6}),If(e,`woodLight`,9.1,-7.2,24,7.2,.015),vf(n,20.2,2.2,-Y/2,`fabricW`),vf(n,20.2,5,-Y/2,`fabricW`),yf(n,21.6,3.6,1.7),X(e,`lounger`,{x:20.2,z:2.2,face:-Y/2,head:[1,0]}),X(e,`lounger`,{x:20.2,z:5,face:-Y/2,head:[1,0]}),Yd(n,15.8,-1.2,.5),Zd(n,15,-1.2,Y/2),Zd(n,16.6,-1.2,-Y/2),X(e,`rail`,{x:18,z:6.9,face:0}),X(e,`rail`,{x:25.6,z:0,face:Y/2}),Bd(n,10,6.4,1.1),Bd(n,10.4,-3.3,1),n.cyl(`steel`,.5,0,.05,3,2.4,6),n.box(`red`,1,0,1,.02,.6,5),n.cyl(`steelDark`,-20.3,5.2,.12,5,0,8),n.box(`red`,-19.7,5.2,1.2,.02,.7,4.2),bf(n,0,.7,7.35,0),bf(n,12,.7,-7.35,Y),n.cyl(`funnel`,-19,-4.6,1.15,3,0,16,.9),n.cyl(`black`,-19,-4.6,1.17,.4,2.8,16,.92),n.blockC(-19,-4.6,2.3,2.3)}var Wf=[zf,Bf,Vf,Hf,Uf],Gf=3.7,Kf=3.4,qf=[`1F`,`2F`,`3F`,`4F`,`5F`],Jf=[`員工生活層`,`運動健康層`,`會議工作層`,`娛樂休閒層`,`董事長辦公層`],Yf={xs:-46,xb:46,hz:13.6,bl:14},Xf=[{xs:-45.9,xb:45.9,hz:13.55,bl:13.9},{xs:-38,xb:38,hz:12,bl:11},{xs:-34,xb:34,hz:10.5,bl:9},{xs:-28,xb:28,hz:9,bl:8},{xs:-22,xb:27,hz:7.5,bl:6}],Zf={x0:10.7,x1:13.3,z0:-6.8,z1:-4.2,cx:12,cz:-5.5,portalZ:-3.6},Z={x0:16,x1:23.2,holeX0:18.4,w:2.4,laneOff:3,arrive:25,bottom:14.4,upTrig:15.4,downTrig:24},Qf=e=>e%2==0?1:-1,$f=e=>Qf(e)*(Z.laneOff+Z.w/2),ep=class{constructor(e,t){this.index=e,this.ship=t,this.name=qf[e],this.title=Jf[e],this.M=t.M,this.env=t.env,this.p=Xf[e],this.poly=Nd(this.p),this.group=new vn,this.b=new Od(this.M),this.nav=new jd,this.tvs=[],this.screens=[],this.waters=[],this.rotors=[],this.doors=[],this.steams=[],this.dyn=[],this.holes=[],this.pois={desks:[],cabins:{},misc:{}},this.tvTex=t.tvTex}hw(e){return Md(e,this.p)}floorY(){return Kf+this.index*Gf}buildFloor(){let e=new ua(this.poly.map(([e,t])=>new B(e,-t)));for(let t of this.holes){let[n,r,i,a]=t,o=new la([new B(n,-r),new B(i,-r),new B(i,-a),new B(n,-a)]);e.holes.push(o)}let t=new Ja(e,{depth:.5,bevelEnabled:!1,curveSegments:1});t.rotateX(-Math.PI/2),t.translate(0,-.5,0);let n=new G(t,[this.M.teak,this.M.white]);n.receiveShadow=!0,n.castShadow=!0,this.group.add(n);let r=new G(t.clone(),this.M.white);r.visible=!1}buildRails(){if(this.index===0){this.buildBulwarkTop();return}let e=this.b,t=this.poly,n=t.length;for(let r=0;r<n;r++){let[i,a]=t[r],[o,s]=t[(r+1)%n],c=o-i,l=s-a,u=Math.hypot(c,l);if(u<.05)continue;let d=(i+o)/2,f=(a+s)/2,p=Math.atan2(-l,c);e.boxc(`glass`,d,.55,f,u,.95,.03,p),e.boxc(`rail`,d,1.04,f,u,.05,.07,p),e.boxc(`rail`,d,.08,f,u,.12,.07,p);let m=Math.max(1,Math.round(u/2.2));for(let t=0;t<=m;t++){let n=t/m;e.cyl(`rail`,i+c*n,a+l*n,.035,1.05,0,6)}}}buildBulwarkTop(){let e=this.b,t=this.poly,n=t.length;for(let r=0;r<n;r++){let[i,a]=t[r],[o,s]=t[(r+1)%n],c=o-i,l=s-a,u=Math.hypot(c,l);if(u<.05)continue;let d=(i+o)/2,f=(a+s)/2,p=Math.atan2(-l,c);e.boxc(`rail`,d,1,f,u,.07,.14,p);let m=Math.max(1,Math.round(u/3));for(let t=0;t<=m;t++){let n=t/m;e.cyl(`rail`,i+c*n,a+l*n,.04,1,0,6)}}}holeRail(e,t,n,r,i=`nesw`){let a=this.b,o=(e,t,n,r)=>{let i=n-e,o=r-t,s=Math.hypot(i,o),c=(e+n)/2,l=(t+r)/2,u=Math.atan2(-o,i);a.boxc(`rail`,c,1,l,s,.05,.06,u),a.boxc(`rail`,c,.5,l,s,.04,.04,u),a.boxc(`glass`,c,.55,l,s,.9,.02,u);let d=Math.max(1,Math.round(s/1.4));for(let n=0;n<=d;n++){let r=n/d;a.cyl(`rail`,e+i*r,t+o*r,.03,1,0,6)}};i.includes(`n`)&&o(e,t,n,t),i.includes(`s`)&&o(e,r,n,r),i.includes(`w`)&&o(e,t,e,r),i.includes(`e`)&&o(n,t,n,r)}finalize(){if(this.buildFloor(),this.buildRails(),this.index<4){let e=Xf[this.index+1];for(let t=e.xs+2;t<e.xb;t+=8)for(let n of[-1,1]){let r=n*(e.hz-.15);this.b.cyl(`white`,t,r,.16,3.2,0,8)}}let e=this.nav,t=this.poly;for(let n=0;n<64;n++)for(let r=0;r<232;r++){let i=e.cx(r),a=e.cz(n);e.cells[n*232+r]=Pd(i,a,t)&&Fd(i,a,t)>.5?1:0}let n=(t,n,r,i)=>{let a=Math.floor((t- -50)/kd),o=Math.floor((r- -50)/kd),s=Math.floor((n- -16)/kd),c=Math.floor((i- -16)/kd);for(let t=Math.max(0,s);t<=Math.min(63,c);t++)for(let n=Math.max(0,a);n<=Math.min(231,o);n++)e.cells[t*232+n]=0};for(let e of this.holes)n(e[0]-.15,e[1]-.15,e[2]+.15,e[3]+.15);for(let e of this.b.blocks)n(...e);this.blockRect=n,this.blockCount=this.b.blocks.length;let r=this.b.build(this.ship.quality.shadows>0);this.group.add(r),this.nav.base.set(e.cells),this.group.traverse(e=>{e.isMesh&&e.parent===this.group&&!e.castShadow&&(e.castShadow=!1)})}setBlock(e,t){let[n,r,i,a]=e,o=this.nav,s=Math.floor((n- -50)/kd),c=Math.floor((i- -50)/kd),l=Math.floor((r- -16)/kd),u=Math.floor((a- -16)/kd);for(let e=l;e<=u;e++)for(let n=s;n<=c;n++)o.inb(n,e)&&(o.cells[e*232+n]=t?0:o.base[e*232+n])}},tp=class{constructor(e,t,n){this.env=e,this.quality=t,this.tvTex=n,this.M=xd(e),this.root=new vn,this.decks=[],this.explode=0,this.explodeTarget=0,this.hull=Id(Yf,4.4,-4.8,this.M),this.root.add(this.hull),this.buildHullDetails();for(let e=0;e<5;e++){let t=new ep(e,this);if(this.decks.push(t),e>=1&&t.holes.push([Zf.x0+.1,Zf.z0+.1,Zf.x1-.1,Zf.z1-.1]),e>=1){let n=$f(e-1);t.holes.push([Z.holeX0,n-Z.w/2,Z.x1,n+Z.w/2])}if(this.addElevatorShaft(t),e<4&&this.addStairFlight(t),e>=1){let n=$f(e-1);t.holeRail(Z.holeX0,n-Z.w/2,Z.x1,n+Z.w/2,`nsw`)}Wf[e](t,this),t.finalize(),this.root.add(t.group)}this.car=new vn;let r=new G(new K(2.3,.1,2.3),this.M.steelDark);r.position.y=0,this.car.add(r);let i=new G(new K(2.3,2.5,2.3),this.M.glassTint);i.position.y=1.3,this.car.add(i);let a=new G(new K(2,.08,2),this.M.lamp);a.position.y=2.5,this.car.add(a),this.car.position.set(Zf.cx,0,Zf.cz),this.root.add(this.car),this.carPos=0,this.carTarget=0,this.shadowMeshes=[],this.rockState={roll:0,pitch:0,heave:0},this.applyExplode(0)}deckY(e){return Kf+e*(Gf+this.explode)}buildHullDetails(){let e=new bi(new K(.6,.42,.06),this.env.windowMat,74),t=new Ut,n=0;for(let r=0;r<37;r++){let i=-44+r*2.4,a=Md(i,Yf);for(let r of[-1,1])t.makeTranslation(i,2.75,r*(a*1.002+.02)),e.setMatrixAt(n++,t)}e.count=n,this.root.add(e)}addElevatorShaft(e){let t=e.b,{x0:n,x1:r,z0:i,z1:a}=Zf,o=3.2;t.box(`steelDark`,Zf.cx,Zf.z0,r-n,.1,o),t.box(`steelDark`,n,Zf.cz,.1,a-i,o),t.box(`steelDark`,r,Zf.cz,.1,a-i,o),t.boxc(`glassTint`,Zf.cx,o*.55,i+.05,r-n,o*.9,.03),t.box(`steelDark`,n+.1,a,.14,.14,o),t.box(`steelDark`,r-.1,a,.14,.14,o),t.box(`steelDark`,Zf.cx,a,r-n,.14,.25,2.3),t.box(`lamp`,Zf.cx,a+.08,.5,.05,.12,2.15),t.block(n,i-.1,r,a+.05),e.index===4&&t.box(`steelDark`,Zf.cx,Zf.cz,r-n+.3,a-i+.3,.2,o)}addStairFlight(e){let t=e.index;Qf(t);let n=$f(t),r=e.b,i=(Z.x1-Z.x0)/20,a=Gf/20;for(let e=0;e<20;e++)r.box(`woodLight`,Z.x0+i*(e+.5),n,i,Z.w,a*(e+1));let o=Math.atan2(Gf,Z.x1-Z.x0),s=Math.hypot(Gf,Z.x1-Z.x0),c=(Z.x0+Z.x1)/2;for(let e of[-1,1]){let t=n+e*(Z.w/2+.03);r.boxc(`white`,c,Gf/2-.1,t,s,.3,.06,0,0,o),r.boxc(`rail`,c,2.8,t,s,.05,.06,0,0,o);for(let e=0;e<=6;e++){let n=e/6,i=Z.x0+(Z.x1-Z.x0)*n;r.box(`rail`,i,t,.05,.05,.95,Gf*n)}}r.block(Z.x0-.1,n-Z.w/2-.15,Z.x1,n+Z.w/2+.15),e.pois.misc.stairUp={x:Z.bottom,z:n,topX:Z.arrive,k:t}}applyExplode(e){this.explode=e;for(let e of this.decks)e.group.position.y=this.deckY(e.index)}setExplode(e){this.explodeTarget=e}yAt(e){return this.deckY(0)+e*(Gf+this.explode)}update(e,t){Math.abs(this.explode-this.explodeTarget)>.01&&this.applyExplode(this.explode+(this.explodeTarget-this.explode)*(1-Math.exp(-4*e)));{let t=this.carTarget-this.carPos,n=Math.min(1.4,.35+Math.abs(t)*.9),r=Math.sign(t)*Math.min(Math.abs(t),n*e);this.carPos+=r,Math.abs(this.carTarget-this.carPos)<.004&&(this.carPos=this.carTarget)}this.car.position.y=this.yAt(this.carPos)+0;let n=[fd(-34,0,t),fd(34,0,t),fd(0,-10,t),fd(0,10,t)],r=Math.atan2(n[1]-n[0],68)*.55,i=Math.atan2(n[2]-n[3],20)*.45,a=(n[0]+n[1]+n[2]+n[3])/4*.5,o=this.rockState;o.roll+=(i-o.roll)*(1-Math.exp(-2*e)),o.pitch+=(r-o.pitch)*(1-Math.exp(-2*e)),o.heave+=(a-o.heave)*(1-Math.exp(-2*e)),this.root.rotation.set(o.pitch*0+0,0,0),this.root.rotation.z=o.pitch,this.root.rotation.x=o.roll,this.root.position.y=o.heave+.1;for(let n of this.decks){for(let t of n.rotors)t.obj.rotation[t.axis]+=t.speed*e;for(let e of n.waters)e.material.opacity=.78+Math.sin(t*1.3)*.03;for(let r of n.dyn)r(e,t)}}setVisibleDecks(e){this.decks.forEach((t,n)=>{t.group.visible=e[n]})}},np=class{constructor(){this.canvas=document.createElement(`canvas`),this.canvas.width=768,this.canvas.height=432,this.ctx=this.canvas.getContext(`2d`),this.tex=new Ei(this.canvas),this.tex.colorSpace=Je,this.tex.anisotropy=4,this.arena=null,this.t=0,this.draw()}setArena(e){this.arena=e,this.draw()}draw(){let e=this.ctx,t=this.canvas.width,n=this.canvas.height,r=e.createLinearGradient(0,0,0,n);r.addColorStop(0,`#0b1626`),r.addColorStop(1,`#050a12`),e.fillStyle=r,e.fillRect(0,0,t,n),e.fillStyle=`#12304f`,e.fillRect(0,0,t,52),e.font=`bold 28px "Noto Sans TC","Microsoft JhengHei",sans-serif`,e.textBaseline=`middle`,e.fillStyle=`#ffd36b`,e.fillText(`🏆 交易競賽 · 直播`,16,27),e.fillStyle=Math.floor(this.t*1.2)%2==0?`#ff3b3b`:`#7a1c1c`,e.beginPath(),e.arc(t-90,27,9,0,7),e.fill(),e.fillStyle=`#fff`,e.font=`bold 22px sans-serif`,e.fillText(`LIVE`,t-72,28);let i=this.arena;if(!i||!i.traders||!i.traders.length){e.fillStyle=`#7f93a8`,e.font=`28px "Noto Sans TC",sans-serif`,e.textAlign=`center`,e.fillText(`等待賽況訊號…`,t/2,n/2),e.textAlign=`left`,this.tex.needsUpdate=!0;return}let a=[`#4fd1ff`,`#ffa94d`,`#9be564`,`#ff7aa8`],o=t-32-190,s=n-66-20;e.fillStyle=`rgba(255,255,255,.04)`,e.fillRect(16,66,o,s);let c=1/0,l=-1/0,u=1/0,d=-1/0;for(let e of i.traders)for(let[t,n]of e.series||[])c=Math.min(c,t),l=Math.max(l,t),u=Math.min(u,n),d=Math.max(d,n);for(let e of i.traders)u=Math.min(u,e.equity,e.start),d=Math.max(d,e.equity,e.start);let f=(d-u)*.1||1;u-=f,d+=f,isFinite(c)||(c=0,l=1),l===c&&(l=c+1),e.strokeStyle=`rgba(255,255,255,.12)`,e.lineWidth=1,e.fillStyle=`#6f879f`,e.font=`16px sans-serif`;for(let t=0;t<=4;t++){let n=66+s-t/4*s;e.beginPath(),e.moveTo(16,n),e.lineTo(16+o,n),e.stroke(),e.fillText((u+(d-u)*t/4).toFixed(0),20,n-8)}let p=66+s-(i.traders[0].start-u)/(d-u)*s;e.setLineDash([6,6]),e.strokeStyle=`rgba(255,255,255,.35)`,e.beginPath(),e.moveTo(16,p),e.lineTo(16+o,p),e.stroke(),e.setLineDash([]),i.traders.forEach((t,n)=>{let r=t.series||[];e.strokeStyle=a[n%a.length],e.lineWidth=3.2,e.beginPath(),r.forEach(([t,n],r)=>{let i=16+(t-c)/(l-c)*o,a=66+s-(n-u)/(d-u)*s;r?e.lineTo(i,a):e.moveTo(i,a)});let i=r.length?r[r.length-1]:null;i?16+(i[0]-c)/(l-c)*o:16+o;let f=66+s-(t.equity-u)/(d-u)*s;e.lineTo(16+o,f),e.stroke(),e.fillStyle=a[n%a.length],e.beginPath(),e.arc(16+o,f,6,0,7),e.fill()});let m=[...i.traders].sort((e,t)=>t.equity-e.equity);e.font=`bold 22px "Noto Sans TC",sans-serif`,e.fillStyle=`#9fb4c8`,e.fillText(`排行`,16+o+22,84),m.forEach((t,n)=>{let r=120+n*92,s=i.traders.indexOf(t);e.fillStyle=`rgba(255,255,255,.06)`,e.fillRect(16+o+14,r-22,164,80),e.fillStyle=a[s%a.length],e.fillRect(16+o+14,r-22,5,80),e.font=`bold 22px "Noto Sans TC",sans-serif`,e.fillText((n===0?`👑 `:``)+t.name,16+o+28,r),e.fillStyle=`#fff`,e.font=`bold 28px sans-serif`,e.fillText(t.equity.toFixed(1)+`U`,16+o+28,r+30);let c=(t.equity-t.start)/t.start*100;e.fillStyle=c>=0?`#4ade80`:`#ff6b6b`,e.font=`20px sans-serif`,e.fillText((c>=0?`+`:``)+c.toFixed(1)+`%`,16+o+28,r+54)}),this.tex.needsUpdate=!0}update(e){this.t+=e,Math.floor(this.t*1.2)!==this._lf&&(this._lf=Math.floor(this.t*1.2),this.draw())}},rp=new EventTarget,ip=(e,t)=>rp.dispatchEvent(new CustomEvent(e,{detail:t})),ap=(e,t)=>{let n=e=>t(e.detail);return rp.addEventListener(e,n),()=>rp.removeEventListener(e,n)},op=[],sp=Math.PI,cp=sp*2,lp;function up(){if(lp)return lp;let e=document.createElement(`canvas`);e.width=e.height=64;let t=e.getContext(`2d`),n=t.createRadialGradient(32,32,1,32,32,31);return n.addColorStop(0,`rgba(255,255,255,1)`),n.addColorStop(.5,`rgba(255,255,255,.55)`),n.addColorStop(1,`rgba(255,255,255,0)`),t.fillStyle=n,t.fillRect(0,0,64,64),lp=new Ei(e)}var dp=(e,t=14)=>new Za(e.map(([e,t])=>new B(e,t)),t),fp=class{constructor(e,t=40){this.items=[],this.i=0;for(let n=0;n<t;n++){let t=new Wr(new Ar({map:up(),transparent:!0,depthWrite:!1,opacity:0,color:16777215}));t.visible=!1,e.add(t),this.items.push({s:t,t:9,v:new V,life:1,sc:1})}}burst(e,t,n,r=6,i=1,a=3){for(let o=0;o<r;o++){let r=this.items[this.i++%this.items.length];r.t=0,r.life=.7+Math.random()*.5,r.sc=i*(.6+Math.random()*.8),r.s.position.set(e,t,n),r.v.set((Math.random()-.5)*2.5,a*(.5+Math.random()),(Math.random()-.5)*2.5),r.s.visible=!0}}update(e){for(let t of this.items){if(t.t>t.life){t.s.visible=!1;continue}t.t+=e;let n=t.t/t.life;t.v.y-=9*e,t.s.position.addScaledVector(t.v,e),t.s.scale.setScalar(t.sc*(.5+n*1.4)),t.s.material.opacity=(1-n)*.8}}};function pp(e){let t=new vn,n=new G(dp([[.02,-1],[.16,-.75],[.27,-.2],[.29,.25],[.22,.7],[.1,1.05],[.02,1.25]]).rotateX(sp/2),e);n.scale.set(1,1,1),t.add(n);let r=new G(new Ni(.07,.34,8).rotateX(sp/2),e);r.position.set(0,-.02,1.35),t.add(r);let i=new G(new Ni(.1,.34,4),e);i.position.set(0,.31,0),i.rotation.x=-.5,i.scale.z=.4,t.add(i);let a=new vn;a.position.z=-.95,t.add(a);let o=new G(new K(.75,.04,.2),e);o.position.z=-.1,a.add(o);let s=new G(new Mi(.06,.12,.35,6).rotateX(sp/2),e);s.position.z=.14,a.add(s);for(let n of[-1,1]){let r=new G(new K(.28,.03,.15),e);r.position.set(n*.3,-.1,.4),r.rotation.z=-n*.5,t.add(r)}return t.userData.tail=a,t.scale.setScalar(1.15),t.traverse(e=>{e.castShadow=!1}),t}function mp(e,t){let n=new vn,r=new G(dp([[.02,-8],[.8,-6],[1.7,-3],[2.2,.5],[2,3.5],[1.2,6],[.5,7.5],[.05,8.3]],18).rotateX(sp/2),e);r.scale.set(1.1,.9,1),n.add(r);let i=new G(new no(1.5,12,10),e);i.scale.set(1.2,.8,1.4),i.position.set(0,.2,7.3),n.add(i);let a=new vn;a.position.z=-7.6,n.add(a);for(let t of[-1,1]){let n=new G(new K(2.8,.18,1.3),e);n.position.set(t*1.5,0,-.5),n.rotation.y=t*.45,a.add(n)}let o=new G(new Ni(.35,.8,4),e);o.position.set(0,1.9,-3),n.add(o);for(let t of[-1,1]){let r=new G(new K(2.1,.12,.8),e);r.position.set(t*2,-.8,3.3),r.rotation.z=-t*.6,r.rotation.y=t*.3,n.add(r)}return n.userData.tail=a,n}function hp(e){let t=new vn,n=new G(new no(.22,8,6),e);n.scale.set(.8,.7,1.7),t.add(n);let r=new G(new no(.1,6,5),e);r.position.set(0,.06,.4),t.add(r);let i=new G(new Ni(.03,.14,4).rotateX(sp/2),new go({color:15773744}));i.position.set(0,.04,.54),t.add(i),t.userData.wings=[];for(let n of[-1,1]){let r=new vn;r.position.set(n*.1,.05,0);let i=new G(new K(.9,.025,.34),e);i.position.x=n*.45,r.add(i),t.add(r),t.userData.wings.push(r)}return t}var gp=class{constructor(e,t,n){this.scene=e,this.env=t,this.q=n,this.rng=qu(42),this.group=new vn,e.add(this.group),this.splash=new fp(e,60),this.t=0,this.dolMat=new go({color:7309978,roughness:.38,metalness:.05}),this.whaleMat=new go({color:4083034,roughness:.5}),this.birdMat=new go({color:15921902,roughness:.8}),this.fishMat=new go({color:13162208,roughness:.25,metalness:.6}),this.dolphins=[],this.whales=[],this.birds=[],this.fish=[],this.debris=[],this.buildDolphins(),this.buildWhales(),this.buildBirds(),this.buildFish(),this.buildDebris(),this.buildRuins()}buildDolphins(){let e=this.q.dolphins>=5?3:(this.q.dolphins,2);for(let t=0;t<e;t++){let e={r:60+t*38+this.rng()*20,a:this.rng()*cp,sp:(.05+this.rng()*.03)*(t%2?-1:1),list:[]},n=Math.max(3,this.q.dolphins-1+ +(t===0));for(let t=0;t<n;t++){let n=pp(this.dolMat);this.group.add(n),e.list.push({m:n,off:t*.9+this.rng()*.4,side:(this.rng()-.5)*7,per:3.4+this.rng()*2.6,ph:this.rng()*5,last:-1,alt:2.2+this.rng()*1.8})}this.dolphins.push(e)}}buildWhales(){for(let e=0;e<2;e++){let t=mp(this.whaleMat);t.visible=!1,this.group.add(t);let n=[];for(let e=0;e<10;e++){let e=new Wr(new Ar({map:up(),transparent:!0,depthWrite:!1,opacity:0}));e.visible=!1,this.scene.add(e),n.push(e)}this.whales.push({m:t,sp:n,a:e*3.2+.8,r:120+e*70,state:`under`,t:4+e*9,dir:1,ph:0,x:0,z:0,hd:0,blown:0})}}buildBirds(){let e=this.q.birds,t=Math.ceil(e/3);for(let e=0;e<3;e++){let n={r:40+e*30,a:this.rng()*cp,h:22+e*9,sp:.08+e*.01,list:[]};for(let e=0;e<t;e++){let e=hp(this.birdMat);e.scale.setScalar(1.6),this.group.add(e),n.list.push({b:e,o:this.rng()*3,ro:(this.rng()-.5)*14,ho:(this.rng()-.5)*8,ph:this.rng()*6})}this.birds.push(n)}}buildFish(){for(let e=0;e<3;e++){let t={list:[],t:5+e*6,state:`wait`,x:0,z:0,hd:0,age:0};for(let e=0;e<7;e++){let e=new vn,n=new G(new no(.1,6,5),this.fishMat);n.scale.set(.5,.5,2.2),e.add(n),e.userData.wings=[];for(let t of[-1,1]){let n=new G(new K(.34,.01,.15),this.fishMat);n.position.set(t*.2,.03,.02),e.add(n),e.userData.wings.push(n)}e.visible=!1,this.group.add(e),t.list.push({g:e,o:this.rng()*1.2,lat:(this.rng()-.5)*5})}this.fish.push(t)}}buildDebris(){let e=[new go({color:9136965,roughness:.9}),new go({color:10238762,roughness:.8}),new go({color:3104122,roughness:.8}),new go({color:7040880,roughness:.7,metalness:.4}),new go({color:14275784,roughness:.9})],t=this.q.debris;for(let n=0;n<t;n++){let t=n%7,r;if(t===0)r=new G(new K(3.2,.18,.5),e[0]);else if(t===1)r=new G(new Mi(.45,.45,.9,10),e[1]);else if(t===2)r=new G(new K(1.1,.8,1.1),e[0]);else if(t===3)r=new G(new ro(.45,.12,8,14),e[4]);else if(t===4)r=new G(new K(6,1.2,2.4),e[2]);else if(t===5)r=new G(new K(2.2,.12,1.6),e[3]);else{r=new vn;let t=new G(new K(5,.8,1.8),e[3]);r.add(t);let n=new G(new K(1.2,.9,1.4),e[4]);n.position.set(-1.3,.8,0),r.add(n),r.rotation.z=.25}let i=this.rng()*cp,a=38+this.rng()*170;r.position.set(Math.cos(i)*a,0,Math.sin(i)*a),r.rotation.y=this.rng()*cp,r.castShadow=!1,this.group.add(r),this.debris.push({m:r,ang:i,r:a,sp:(this.rng()-.5)*.002,bob:this.rng()*6,k:t,spin:(this.rng()-.5)*.05,ty:t===4?-.2:t===6?.1:.05})}}buildRuins(){if(!this.q.ruins)return;let e=new vn,t=new go({color:4870744,roughness:.9}),n=new go({color:3817798,roughness:.95}),r=qu(7);for(let[i,a,o]of[[-760,-380,.9],[620,-640,1],[880,330,.7],[-300,860,.8],[140,-980,1.1],[-980,220,.8]]){let s=9+Math.floor(r()*9);for(let c=0;c<s;c++){let l=(10+r()*22)*o,u=(10+r()*22)*o,d=(24+r()*120)*o*(.4+(1-c/s)),f=new G(new K(l,d,u),r()<.5?t:n);if(f.position.set(i+(r()-.5)*220*o,d/2-12-r()*14,a+(r()-.5)*160*o),f.rotation.set((r()-.5)*.25,r()*3,(r()-.5)*.3),e.add(f),r()<.6){let t=new G(new K(l*.7,d*.15,u*.7),n);t.position.copy(f.position),t.position.y+=d*.46,t.rotation.copy(f.rotation),t.rotation.z+=.5,e.add(t)}}}for(let[r,i]of[[360,760],[-620,-760]]){for(let n of[0,1]){let a=new G(new K(10,140,10),t);a.position.set(r+n*80,50,i),a.rotation.z=(n-.5)*.12,e.add(a)}let a=new G(new K(110,3,7),n);a.position.set(r+40,12,i),a.rotation.z=.08,e.add(a)}this.ruins=e,this.scene.add(e),this.ruinsMat=[t,n]}update(e,t,n){this.t=t;let r=n?n.nightF:0;if(this.updateDolphins(e,t),this.updateWhales(e,t),this.updateBirds(e,t,r),this.updateFish(e,t),this.updateDebris(e,t),this.splash.update(e),this.ruinsMat){let e=.25+(1-r)*.75;this.ruinsMat[0].color.setRGB(.29*e,.32*e,.35*e),this.ruinsMat[1].color.setRGB(.23*e,.25*e,.28*e)}}updateDolphins(e,t){for(let n of this.dolphins){n.a+=n.sp*e;for(let e of n.list){let r=n.a-e.off*.012*Math.sign(n.sp||1),i=n.r+e.side,a=Math.cos(r)*i,o=Math.sin(r)*i,s=-Math.sin(r)*Math.sign(n.sp),c=Math.cos(r)*Math.sign(n.sp),l=(t+e.ph)%e.per/e.per;.5/e.per*1+0;let u=e.alt/e.per,d,f=0,p=!0;if(l<u){let n=l/u;d=Math.sin(n*sp)*(2.2+e.side*.05+.6)-.5,f=Math.cos(n*sp)*.9,e.last,e.last!==1&&n>.04&&(e.last=1,this.splash.burst(a,fd(a,o,t),o,5,.8,2.5))}else d=-2.5,p=!1,e.last===1&&(e.last=0,this.splash.burst(a+s*3,fd(a,o,t),o+c*3,6,1,3.2));let m=fd(a,o,t);e.m.visible=p,e.m.position.set(a,m+d,o),e.m.rotation.set(0,0,0),e.m.rotation.y=Math.atan2(s,c),e.m.rotateX(-f*.95),e.m.userData.tail.rotation.x=Math.sin(t*14+e.ph)*.4}}}updateWhales(e,t){for(let n of this.whales){if(n.t-=e,n.state===`under`){if(n.m.visible=!1,n.t<=0){n.state=`rise`,n.t=3,n.a+=(Math.random()-.5)*.9;let e=n.r+(Math.random()-.5)*40;n.x=Math.cos(n.a)*e,n.z=Math.sin(n.a)*e,n.hd=n.a+sp/2*(Math.random()<.5?1:-1)+(Math.random()-.5)*.6,n.blown=0,n.m.visible=!0}}else if(n.state===`rise`||n.state===`surf`||n.state===`dive`){let r=n.state===`surf`?1.6:2.4;n.x+=Math.sin(n.hd)*r*e,n.z+=Math.cos(n.hd)*r*e;let i=0,a=0;if(n.state===`rise`){let e=1-n.t/3;i=-3.4+3*Wu(0,1,e),a=-.25*(1-e),n.t<=0&&(n.state=`surf`,n.t=9+Math.random()*4)}else if(n.state===`surf`)i=-.5+Math.sin(t*.9)*.18,a=Math.sin(t*.7)*.05,n.blown<3&&n.t<12-n.blown*3.2&&(this.spout(n,t),n.blown++),n.t<=0&&(n.state=`dive`,n.t=4.5);else{let e=1-n.t/4.5;i=-.5-4.5*Wu(0,1,e),a=.45*e,n.m.userData.tail.rotation.x=-.6*Math.sin(e*sp),n.t<=0&&(n.state=`under`,n.t=22+Math.random()*25,n.m.visible=!1)}let o=fd(n.x,n.z,t);n.m.position.set(n.x,o+i,n.z),n.m.rotation.set(0,n.hd,0),n.m.rotateX(-a),n.state!==`dive`&&(n.m.userData.tail.rotation.x=Math.sin(t*1.2)*.1),n.spoutT!==void 0&&n.spoutT>=0&&this.updateSpout(n,e)}n.spoutT!==void 0&&n.spoutT>=0&&n.state===`under`&&this.updateSpout(n,e)}}spout(e,t){e.spoutT=0,e.spoutX=e.x+Math.sin(e.hd)*5.5,e.spoutZ=e.z+Math.cos(e.hd)*5.5,e.spoutY=fd(e.x,e.z,t)+.6}updateSpout(e,t){e.spoutT+=t,e.sp.forEach((t,n)=>{let r=e.spoutT/2.4-n*.025;if(r<0||r>1){t.visible=!1;return}t.visible=!0;let i=Math.min(1,r*1.6),a=10*(1-(1-i)*(1-i))+(r>.6?-(r-.6)*6:0);t.position.set(e.spoutX+(n%3-1)*r*1.4,e.spoutY+a*(.5+n/e.sp.length*.5),e.spoutZ+(n*7%3-1)*r*1.2),t.scale.setScalar(1.6+r*3.6),t.material.opacity=(1-r)*.8}),e.spoutT>2.8&&(e.spoutT=-1,e.sp.forEach(e=>e.visible=!1))}updateBirds(e,t,n){for(let r of this.birds){r.a+=r.sp*e;for(let e of r.list){let i=r.a+e.o*.08,a=r.r+e.ro+Math.sin(t*.1+e.ph)*6,o=Math.cos(i)*a,s=Math.sin(i)*a,c=r.h+e.ho+Math.sin(t*.35+e.ph)*2.2;e.b.position.set(o,c,s),e.b.rotation.y=Math.atan2(-Math.sin(i),Math.cos(i)),e.b.rotation.z=-.25;let l=Math.sin(t*7+e.ph)*(Math.sin(t*.3+e.ph)>.2?.1:.7);e.b.userData.wings[0].rotation.z=l,e.b.userData.wings[1].rotation.z=-l,e.b.visible=n<.8}}}updateFish(e,t){for(let n of this.fish)if(n.t-=e,n.state===`wait`){if(n.t<=0){n.state=`fly`,n.age=0;let e=Math.random()*cp,t=35+Math.random()*60;n.x=Math.cos(e)*t,n.z=Math.sin(e)*t,n.hd=e+sp+(Math.random()-.5)*1.6,n.dur=2.4+Math.random()*1.2}}else{n.age+=e;for(let r of n.list){let i=n.age-r.o,a=i>0&&i<n.dur;if(r.g.visible=a,!a)continue;let o=n.x+Math.sin(n.hd)*9*i+Math.cos(n.hd)*r.lat,s=n.z+Math.cos(n.hd)*9*i-Math.sin(n.hd)*r.lat,c=i/n.dur,l=fd(o,s,t)+.25+Math.sin(c*sp)*(.7+.4*Math.sin(r.lat));r.g.position.set(o,l,s),r.g.rotation.set(0,n.hd,0),r.g.rotateX(-Math.cos(c*sp)*.25);let u=Math.sin(t*40+r.o*9)*.3;r.g.userData.wings[0].rotation.z=u,r.g.userData.wings[1].rotation.z=-u,i<e*1.5&&this.splash.burst(o,fd(o,s,t),s,1,.3,1.5)}if(n.age>n.dur+1.5){n.state=`wait`,n.t=14+Math.random()*25;for(let e of n.list)e.g.visible=!1}}}updateDebris(e,t){for(let n of this.debris){n.ang+=n.sp*e;let r=Math.cos(n.ang)*n.r,i=Math.sin(n.ang)*n.r,a=fd(r,i,t),o=fd(r+1.5,i,t)-fd(r-1.5,i,t),s=fd(r,i+1.5,t)-fd(r,i-1.5,t);n.m.position.set(r,a+n.ty,i),n.m.rotation.x=s*.2,n.m.rotation.z=(n.k===6?.25:0)-o*.2,n.m.rotation.y+=n.spin*e}}},_p={},vp=(e,t)=>_p[e]||(_p[e]=t()),yp=(e,t)=>vp(`limb${e}_${t}`,()=>new Ai(t,e-t,4,8).translate(0,-(e+t)/2,0)),bp=new Map,xp=(e,t={})=>{let n=e+JSON.stringify(t);return bp.has(n)||bp.set(n,new go({color:e,roughness:.75,metalness:0,...t})),bp.get(n)},Sp={T董:{shirt:2765124,pants:2040883,skin:15779744,hair:15329774,acc:[`sunglasses`,`tie`,`goldpin`],scale:1.08,tie:12589090},最高級打工仔:{shirt:2834296,pants:2106938,skin:15318678,hair:1380622,acc:[`glasses`,`tie`],tie:14201434},"交易員-1":{shirt:14239791,pants:2764602,skin:15120527,hair:4860954,acc:[`headband`]},"交易員-2":{shirt:2074040,pants:2764602,skin:15780260,hair:14858314,acc:[`cap`],capCol:941419},"0xcat":{shirt:8080324,pants:3156042,skin:15713954,hair:2826288,acc:[`catears`,`hood`]},策略研究員:{shirt:15856629,pants:4025167,skin:14988428,hair:1911584,acc:[`glasses`,`labcoat`]},鏈上獵手:{shirt:2764586,pants:2304043,skin:14264190,hair:8014370,acc:[`scarf`,`goggles`],scarf:14710314}};function Cp(e){let t=0;for(let n of e)t=t*31+n.charCodeAt(0)|0;let n=Math.abs(t)%360/360;return{shirt:new U().setHSL(n,.55,.45).getHex(),pants:2764602,skin:15252886,hair:2760472,acc:[]}}var wp={stand:{hipY:.89,spine:0,head:0,lSx:0,lSz:.07,lEx:-.08,rSx:0,rSz:-.07,rEx:-.08,lH:0,lK:0,rH:0,rK:0,pitch:0},sit:{hipY:.5,spine:.04,head:0,lSx:-.35,lSz:.06,lEx:-.9,rSx:-.35,rSz:-.06,rEx:-.9,lH:-1.5,lK:1.5,rH:-1.5,rK:1.5,pitch:0},type:{hipY:.5,spine:.12,head:.12,lSx:-.95,lSz:.08,lEx:-1.05,rSx:-.95,rSz:-.08,rEx:-1.05,lH:-1.5,lK:1.5,rH:-1.5,rK:1.5,pitch:0},think:{hipY:.5,spine:0,head:.18,lSx:-.45,lSz:.08,lEx:-1.1,rSx:-.55,rSz:0,rEx:-2.4,lH:-1.5,lK:1.5,rH:-1.5,rK:1.5,pitch:0},eat:{hipY:.5,spine:.1,head:.1,lSx:-.8,lSz:.06,lEx:-1,rSx:-.7,rSz:-.05,rEx:-1.2,lH:-1.5,lK:1.5,rH:-1.5,rK:1.5,pitch:0},lie:{hipY:.89,spine:0,head:0,lSx:0,lSz:.12,lEx:-.1,rSx:0,rSz:-.12,rEx:-.1,lH:0,lK:0,rH:0,rK:0,pitch:-1.5},lounge:{hipY:.89,spine:0,head:.1,lSx:-.5,lSz:.1,lEx:-.5,rSx:-.3,rSz:-.1,rEx:-1.3,lH:-.15,lK:.35,rH:-.1,rK:.25,pitch:-1.3},swim:{hipY:.89,spine:0,head:-.5,lSx:-2.8,lSz:.1,lEx:-.2,rSx:-2.8,rSz:-.1,rEx:-.2,lH:0,lK:.1,rH:0,rK:.1,pitch:1.5},wave:{hipY:.89,spine:0,head:0,lSx:0,lSz:.07,lEx:-.08,rSx:-2.7,rSz:-.2,rEx:-.3,lH:0,lK:0,rH:0,rK:0,pitch:0},swing:{hipY:.84,spine:.1,head:0,lSx:-.4,lSz:.4,lEx:-.4,rSx:-.7,rSz:-.3,rEx:-.9,lH:-.25,lK:.35,rH:.25,rK:.35,pitch:0},stretch:{hipY:.89,spine:-.05,head:-.2,lSx:-3,lSz:.2,lEx:-.15,rSx:-3,rSz:-.2,rEx:-.15,lH:0,lK:0,rH:0,rK:0,pitch:0},arcade:{hipY:.89,spine:.06,head:-.1,lSx:-.9,lSz:.1,lEx:-.7,rSx:-.9,rSz:-.1,rEx:-.7,lH:0,lK:0,rH:0,rK:0,pitch:0},rail:{hipY:.89,spine:.12,head:-.1,lSx:-.9,lSz:.15,lEx:-.6,rSx:-.9,rSz:-.15,rEx:-.6,lH:0,lK:0,rH:0,rK:0,pitch:0},drink:{hipY:.89,spine:0,head:-.05,lSx:0,lSz:.1,lEx:-.1,rSx:-.5,rSz:-.05,rEx:-2.2,lH:0,lK:0,rH:0,rK:0,pitch:0},lift:{hipY:.89,spine:0,head:0,lSx:-.2,lSz:.1,lEx:-1.9,rSx:-.2,rSz:-.1,rEx:-1.9,lH:0,lK:0,rH:0,rK:0,pitch:0},shoot:{hipY:.85,spine:-.05,head:-.3,lSx:-2.5,lSz:.1,lEx:-.6,rSx:-2.7,rSz:-.1,rEx:-.4,lH:-.1,lK:.2,rH:-.1,rK:.2,pitch:0},chat:{hipY:.89,spine:0,head:0,lSx:-.3,lSz:.12,lEx:-.9,rSx:-.3,rSz:-.12,rEx:-.9,lH:0,lK:0,rH:0,rK:0,pitch:0},hello:{hipY:.89,spine:0,head:0,lSx:-.3,lSz:.12,lEx:-.9,rSx:-.3,rSz:-.12,rEx:-.9,lH:0,lK:0,rH:0,rK:0,pitch:0},sleepy:{hipY:.89,spine:.25,head:.35,lSx:0,lSz:.07,lEx:-.08,rSx:0,rSz:-.07,rEx:-.08,lH:0,lK:0,rH:0,rK:0,pitch:0}},Tp={walk:{f:5.2,amp:.62,bob:.025},run:{f:8.2,amp:1,bob:.05}},Ep=class{constructor(e,t){this.key=e,t=t||Sp[e]||Cp(e),this.look=t;let n=t.scale||1,r=this.group=new vn;r.name=`avatar:`+e,this.body=new vn,r.add(this.body),this.body.scale.setScalar(n),this.hips=new vn,this.body.add(this.hips);let i=xp(t.shirt),a=xp(t.pants),o=xp(t.skin,{roughness:.6}),s=xp(t.hair,{roughness:.55}),c=xp(1710622),l=(e,t,n,r=0,i=0,a=0)=>{let o=new G(e,t);return o.position.set(r,i,a),o.castShadow=!0,n.add(o),o};this.spine=new vn,this.hips.add(this.spine),l(vp(`pelv`,()=>new K(.33,.16,.2)),a,this.hips,0,-.02,0),l(vp(`torso`,()=>new Ai(.16,.26,4,10).scale(1.08,1,.74)),i,this.spine,0,.3,0),this.head=new vn,this.head.position.y=.64,this.spine.add(this.head),l(vp(`neck`,()=>new Mi(.045,.05,.1,8)),o,this.head,0,.02,0);let u=l(vp(`head`,()=>new no(.15,20,16).scale(1,1.05,1)),o,this.head,0,.19,0),d=l(vp(`hair`,()=>new no(.158,20,12,0,Math.PI*2,0,Math.PI*.56).scale(1,1.06,1.03)),s,this.head,0,.195,-.01);d.rotation.x=-.22,this.hair=d;let f=xp(1447450,{roughness:.3});for(let e of[-1,1])l(vp(`eye`,()=>new no(.019,8,6)),f,this.head,e*.056,.2,.138);l(vp(`mouth`,()=>new K(.05,.01,.01)),xp(9058874),this.head,0,.14,.147),this.arms={};for(let[e,t]of[[`l`,1],[`r`,-1]]){let n=new vn;n.position.set(t*.225,.52,0),this.spine.add(n),l(vp(`shoulder`,()=>new no(.062,10,8)),i,n),l(yp(.3,.052),i,n);let r=new vn;r.position.y=-.3,n.add(r),l(yp(.27,.045),i,r),l(vp(`hand`,()=>new no(.05,10,8)),o,r,0,-.29,0),this.arms[e]={sh:n,el:r}}this.legs={};for(let[e,t]of[[`l`,1],[`r`,-1]]){let n=new vn;n.position.set(t*.09,-.04,0),this.hips.add(n),l(yp(.43,.075),a,n);let r=new vn;r.position.y=-.43,n.add(r),l(yp(.4,.062),a,r),l(vp(`shoe`,()=>new K(.1,.07,.24)),c,r,0,-.43,.05),this.legs[e]={hp:n,kn:r}}this.accessories(t,l,i,o,s);let p=xp(16052714,{roughness:.95}),m=xp(14262456,{roughness:.9});this.robe=new vn,this.robe.visible=!1,this.body.add(this.robe);let h=new G(vp(`robeT`,()=>new Ai(.18,.28,4,10).scale(1.15,1,.85)),p);h.position.y=.3,this.spine.add(h),this.robe.add(h);let g=new G(vp(`robeS`,()=>new Mi(.2,.25,.46,14,1,!0)),p);g.material=p.clone(),g.material.side=2,g.position.y=-.22,this.hips.add(g),this.robe.add(g);let _=new G(vp(`robeB`,()=>new ro(.175,.025,6,16).rotateX(Math.PI/2)),m);_.position.y=.06,this.spine.add(_),this.robe.add(_),this.robeParts=[h,g,_];for(let e of[`l`,`r`]){let t=new G(yp(.3,.07),p);this.arms[e].sh.add(t),this.robeParts.push(t);let n=new G(yp(.17,.065),p);this.arms[e].el.add(n),this.robeParts.push(n)}this.towel=new G(vp(`towel`,()=>new no(.175,14,10,0,Math.PI*2,0,Math.PI*.5).scale(1,.9,1.1)),p),this.towel.position.set(0,.2,-.01),this.towel.visible=!1,this.head.add(this.towel),this.robeParts.forEach(e=>{e.visible=!1,e.castShadow=!0}),this.items={};let v=this.arms.r.el,y=new vn;l(vp(`rkH`,()=>new Mi(.018,.018,.18,6)),xp(7031338),y,0,-.1,0);let b=l(vp(`rkD`,()=>new Mi(.115,.115,.015,18).rotateX(Math.PI/2)),xp(12725035),y,0,-.27,0);b.rotation.y=0,y.position.set(0,-.29,.02),y.rotation.x=-1.4,y.visible=!1,v.add(y),this.items.racket=y;let x=new vn;l(vp(`mug`,()=>new Mi(.035,.03,.08,10)),xp(15921904),x,0,0,0),l(vp(`mugl`,()=>new Mi(.03,.03,.005,10)),xp(5913122),x,0,.038,0),x.position.set(0,-.3,.06),x.visible=!1,v.add(x),this.items.mug=x;let S=l(vp(`ballH`,()=>new no(.115,14,10)),xp(14250795),this.arms.l.el,0,-.34,.1);S.visible=!1,this.items.ball=S,this.cur={...wp.stand},this.tgt={...wp.stand},this.poseName=`stand`,this.phase=Math.random()*6,this.speed=0,this.gait=`walk`,this.swingT=0,this.talk=0,this.t=Math.random()*10,this.blink=0,this.heads=u,this.bobY=0,this.setPose(`stand`)}accessories(e,t,n,r,i){let a=new Set(e.acc||[]),o=xp(1118484,{roughness:.3});if(a.has(`glasses`))for(let e of[-1,1]){let n=t(vp(`gl`,()=>new ro(.036,.007,6,14)),o,this.head,e*.06,.2,.15);n.rotation.y=0}if(a.has(`sunglasses`)&&t(vp(`sg`,()=>new K(.28,.045,.03)),o,this.head,0,.205,.145),a.has(`goggles`)){t(vp(`gg`,()=>new K(.29,.07,.05)),xp(14710314,{roughness:.4}),this.head,0,.3,.1);for(let e of[-1,1])t(vp(`ggl`,()=>new Mi(.04,.04,.03,10).rotateX(Math.PI/2)),xp(7327999,{roughness:.1,metalness:.3}),this.head,e*.07,.3,.13)}if(a.has(`headband`)&&t(vp(`hb`,()=>new ro(.152,.018,6,20).rotateX(Math.PI/2)),xp(16777215),this.head,0,.255,0),a.has(`cap`)){let n=e.capCol||2250103;t(vp(`cap`,()=>new no(.165,16,10,0,Math.PI*2,0,Math.PI*.5)),xp(n),this.head,0,.22,-.005),t(vp(`capb`,()=>new K(.2,.012,.13)),xp(n),this.head,0,.22,.17).rotation.x=.1,this.hair&&(this.hair.visible=!1)}if(a.has(`catears`))for(let n of[-1,1]){let r=t(vp(`ear`,()=>new Ni(.05,.11,4)),xp(e.shirt),this.head,n*.1,.36,-.01);r.rotation.z=-n*.25}if(a.has(`hood`)&&(t(vp(`hood`,()=>new ro(.16,.05,8,18,Math.PI*1.2)),n,this.spine,0,.7,-.07).rotation.x=Math.PI*.45),a.has(`tie`)){let n=t(vp(`tie`,()=>new K(.05,.28,.02)),xp(e.tie||12589090),this.spine,0,.38,.122);n.rotation.x=-.05}if(a.has(`goldpin`)&&t(vp(`pin`,()=>new no(.02,8,6)),xp(16764736,{metalness:.9,roughness:.25}),this.spine,.1,.5,.12),a.has(`scarf`)&&(t(vp(`scarf`,()=>new ro(.115,.05,8,16).rotateX(Math.PI/2)),xp(e.scarf||14710314),this.head,0,0,0),t(vp(`scarft`,()=>new K(.07,.24,.03)),xp(e.scarf||14710314),this.spine,.08,.5,.11)),a.has(`labcoat`)){let e=new G(vp(`lab`,()=>new Ai(.175,.3,4,10).scale(1.12,1,.8)),xp(16777215,{roughness:.9}));e.position.y=.26,this.spine.add(e),e.castShadow=!0;let t=new G(vp(`lab2`,()=>new K(.34,.3,.3)),xp(16777215,{roughness:.9}));t.position.set(0,-.1,0),t.scale.set(1,1,.75),this.hips.add(t)}}setPose(e){let t=wp[e]||wp.stand;this.poseName=e,this.tgt=t}setRobe(e){this.robe.visible=e,this.robeParts.forEach(t=>t.visible=e),this.towel.visible=e}hold(e){for(let t in this.items)this.items[t].visible=t===e}swing(){this.swingT=1}update(e,t){this.t+=e;let n=this.cur,r=this.tgt,i=1-Math.exp(-11*e);for(let e in r)n[e]+=(r[e]-n[e])*i;let a=this.speed>.15,o=this.poseName,s=o===`stand`||o===`chat`||o===`hello`||o===`sleepy`||o===`wave`||o===`drink`,c=Tp[this.gait],l=n.hipY,u=n.lH,d=n.rH,f=n.lK,p=n.rK,m=n.lSx,h=n.rSx,g=n.lEx,_=n.rEx,v=n.spine,y=n.head,b=n.lSz,x=n.rSz;if(a&&(s||o===`treadmill`)){this.phase+=e*c.f*Math.min(1.6,this.speed/(this.gait===`run`?3:1.45)+.35);let t=Math.sin(this.phase),r=c.amp*Math.min(1,this.speed/1.2);u=t*r,d=-t*r,f=Math.max(0,-Math.sin(this.phase+.6))*r*1.5,p=Math.max(0,Math.sin(this.phase+.6))*r*1.5,m=-t*r*.75,h=t*r*.75,g=-.2-(this.gait===`run`?.9:.1),_=g,l=n.hipY-.03+Math.abs(Math.cos(this.phase))*c.bob,v=this.gait===`run`?.2:.04}if(o===`type`&&(g+=Math.sin(this.t*17)*.05,_+=Math.sin(this.t*14+1)*.05,y+=Math.sin(this.t*.9)*.05),o===`chat`&&(_+=Math.sin(this.t*3.1)*.4*this.talk,h+=Math.sin(this.t*2.3)*.25*this.talk,g+=Math.sin(this.t*2.7+1)*.3*this.talk,y+=Math.sin(this.t*4.2)*.07*this.talk),o===`wave`&&(_=-.3+Math.sin(this.t*9)*.5),o===`eat`&&(_=-1.2-(Math.sin(this.t*2.6)*.5+.5)*.9),o===`lift`&&(g=_=-1.2-(Math.sin(this.t*2.2)*.5+.5)*1.2),o===`arcade`&&(b+=Math.sin(this.t*9)*.08,_+=Math.sin(this.t*12)*.2),o===`swim`){let e=this.t*4.2;m=-2.7+Math.sin(e)*1,h=-2.7+Math.sin(e+Math.PI)*1,u=Math.sin(this.t*11)*.25,d=-u,y=-.5+Math.sin(e*.5)*.15}if(o===`sleepy`&&(y+=Math.sin(this.t*1.5)*.08),(o===`swing`||this.swingT>0)&&this.swingT>0){this.swingT=Math.max(0,this.swingT-e*2.8);let t=Math.sin((1-this.swingT)*Math.PI);h=-.4-t*1.5,x=-.3+t*.55,v+=t*.35}o===`stretch`&&(m+=Math.sin(this.t*3)*.1,h+=Math.sin(this.t*3)*.1),this.hips.position.y=l,this.spine.rotation.x=v,this.head.rotation.x=y,this.body.rotation.x=n.pitch,this.arms.l.sh.rotation.set(m,0,b),this.arms.r.sh.rotation.set(h,0,x),this.arms.l.el.rotation.x=g,this.arms.r.el.rotation.x=_,this.legs.l.hp.rotation.x=u,this.legs.r.hp.rotation.x=d,this.legs.l.kn.rotation.x=f,this.legs.r.kn.rotation.x=p,this.body.position.y=0}},Dp=(e,t)=>t>0?{x:Z.upTrig,z:$f(e)}:{x:Z.downTrig,z:$f(e)},Op={x:Zf.cx,z:Zf.portalZ},kp=class{constructor(e,t,n=0,r=0,i=0){this.game=e,this.ship=e.ship,this.avatar=t,this.deck=n,this.x=r,this.z=i,this.yaw=0,this.yOff=0,this.speed=0,this.baseSpeed=1.45,this.steps=[],this.cur=null,this.path=null,this.pi=0,this.locked=!1,this.hidden=!1,this.mode=`walk`,this.snapTo=null,this.place(n,r,i,0)}get deckObj(){return this.ship.decks[this.deck]}get nav(){return this.deckObj.nav}get busy(){return!!this.cur||this.steps.length>0}place(e,t,n,r=this.yaw){e===this.deck&&this.avatar.group.parent||(this.deck=e,this.ship.decks[e].group.add(this.avatar.group)),this.x=t,this.z=n,this.yaw=r,this.yOff=0,this.sync()}sync(){let e=this.avatar.group;e.position.set(this.x,this.yOff,this.z),e.rotation.y=this.yaw}reparent(e){this.deck=e,this.ship.decks[e].group.add(this.avatar.group)}clear(){this.steps.length=0,this.cur=null,this.path=null,this.speed=0,this.elevHeld&&this.releaseElev()}releaseElev(){this.ship.elevLock===this&&(this.ship.elevLock=null),this.elevHeld=!1}routeTo(e,t,n,r={}){this.clear(),this.mode=r.run?`run`:`walk`,this.speedMul=r.speedMul||1;let i=this.deck,a=[];if(i!==e){if(r.elevator??(Math.abs(e-i)>=3&&!this.ship.elevLock&&Math.random()<.5))a.push({t:`walk`,deck:i,x:Op.x,z:Op.z}),a.push({t:`elev`,from:i,to:e}),i=e;else for(;i!==e;){let t=e>i?1:-1,n=t>0?i:i-1,r=Dp(n,t);a.push({t:`walk`,deck:i,x:r.x,z:r.z}),a.push({t:`stair`,k:n,dir:t}),i+=t}}a.push({t:`walk`,deck:e,x:t,z:n,final:!0}),this.steps=a,this.arrivedFace=r.face}queue(e){this.steps.push(e)}next(){this.cur=this.steps.shift()||null,this.path=null,this.cur&&this.begin(this.cur)}begin(e){if(e.t===`walk`){let t=this.ship.decks[e.deck].nav.findPath(this.x,this.z,e.x,e.z);t||(t=[[e.x,e.z]],e.fallback=!0),this.path=t,this.pi=0}else e.t===`stair`?(e.p=0,e.len=(Z.x1-Z.x0+1.6)*.95,this.reparent((e.dir,e.k)),this.yOff=e.dir>0?0:Gf+this.ship.explode,this.yaw=e.dir>0?Math.PI/2:-Math.PI/2,this.z=$f(e.k)):e.t===`elev`?e.phase===void 0&&(e.phase=0):e.t===`direct`&&(e.sx=this.x,e.sz=this.z)}speedNow(){return this.baseSpeed*(this.mode===`run`?2.3:1)*(this.speedMul||1)}update(e){if(this.locked){this.speed=0,this.sync();return}this.cur||this.steps.length&&this.next();let t=this.cur,n=0;if(t){if(t.t===`walk`){let r=this.ship.decks[this.deck].nav,i=this.path[this.pi];if(!i)this.finishStep();else{let a=i[0]-this.x,o=i[1]-this.z,s=Math.hypot(a,o),c=this.speedNow(),l=Math.min(s,c*e);if(s<.08)this.pi++,this.pi>=this.path.length&&this.finishStep();else{let i=this.x+a/s*l,c=this.z+o/s*l;if(t.fallback)this.x=i,this.z=c;else{let n=r.move(this.x,this.z,i-this.x,c-this.z,.26);this.x=n[0],this.z=n[1],Math.hypot(n[0]-i,n[1]-c)>.001?(t.stuck=(t.stuck||0)+e,t.stuck>1.5&&(this.pi++,t.stuck=0,this.pi>=this.path.length&&this.finishStep())):t.stuck=0}this.yaw=Ku(this.yaw,Math.atan2(a,o),12,e),n=l/e}}}else if(t.t===`stair`){let r=(this.mode===`run`?2.4:1.5)*(this.speedMul||1);t.p+=e*r/t.len*1;let i=Hu(t.p,0,1),a=Gf+this.ship.explode;t.dir>0||1-i,this.x=(t.dir>0?Z.upTrig:Z.downTrig)+(t.dir>0?1:-1)*0;let o=t.dir>0?Z.upTrig:Z.arrive-1,s=t.dir>0?Z.arrive:Z.bottom+0;if(this.x=o+(s-o)*i,this.yOff=a*Hu((this.x-Z.x0)/(Z.x1-Z.x0),0,1),this.z=$f(t.k),n=r*1.2,this.avatar.stairLean=.12,t.p>=1){this.avatar.stairLean=0;let e=t.k+ +(t.dir>0);this.reparent(e),this.yOff=0,this.x=t.dir>0?Z.arrive:Z.bottom,this.finishStep()}}else if(t.t===`elev`)n=this.updateElev(t,e);else if(t.t===`direct`){let r=t.x-this.x,i=t.z-this.z,a=Math.hypot(r,i),o=Math.min(a,1.4*e);a<.03?this.finishStep():(this.x+=r/a*o,this.z+=i/a*o,this.yaw=Ku(this.yaw,Math.atan2(r,i),12,e),n=1.4)}else if(t.t===`follow`){let r=t.pts,i=r.length;t.i=t.i??t.start??0;let a=r[t.i%i],o=a.x-this.x,s=a.z-this.z,c=Math.hypot(o,s),l=t.speed||3;if(c<.3)t.i++,t.count=(t.count||0)+1,t.count>=i*t.laps&&this.finishStep();else{let t=Math.min(c,l*e);this.x+=o/c*t,this.z+=s/c*t,this.yaw=Ku(this.yaw,Math.atan2(o,s),8,e),n=l}}else if(t.t===`glide`){t.t0=(t.t0||0)+e;let n=1-Math.exp(-10*e);this.x+=(t.x-this.x)*n,this.z+=(t.z-this.z)*n,this.yaw=Ku(this.yaw,t.yaw,12,e),this.yOff+=((t.y||0)-this.yOff)*n,t.t0>.35&&(this.x=t.x,this.z=t.z,this.yaw=t.yaw,this.yOff=t.y||0,this.finishStep())}}this.speed+=(n-this.speed)*(1-Math.exp(-14*e)),this.avatar.speed=this.avatar.fixedSpeed??this.speed,this.avatar.gait=this.avatar.fixedGait||(this.mode===`run`?`run`:`walk`),this.sync()}finishStep(){let e=this.cur;this.cur=null,this.path=null,e&&e.final&&this.arrivedFace!==void 0&&this.steps.unshift({t:`glide`,x:this.x,z:this.z,yaw:this.arrivedFace,y:0}),e&&e.onDone&&e.onDone(),this.steps.length?this.next():e&&(this.speed=0,this.mode=`walk`)}updateElev(e,t){let n=this.ship,r=Zf;if(e.phase===0)return n.elevLock&&n.elevLock!==this||(n.elevLock=this,this.elevHeld=!0,n.carTarget=e.from,e.phase=1),0;if(e.phase===1){if(Math.abs(n.carPos-e.from)<.02){e.phase=2;let t=this.cur;this.steps.unshift(t),this.steps.unshift({t:`direct`,x:r.cx,z:r.cz+.45}),this.cur=null,this.next()}return 0}if(e.phase===2)return this.avatar.group.removeFromParent(),n.car.add(this.avatar.group),this.inCar=!0,this.carLocal={x:this.x-r.cx,z:this.z-r.cz},e.phase=3,n.carTarget=e.to,this.yaw=0,0;if(e.phase===3){if(this.avatar.group.position.set(this.carLocal.x,.06,this.carLocal.z),this.avatar.group.rotation.y=0,Math.abs(n.carPos-e.to)<.02){this.inCar=!1,this.reparent(e.to),this.x=r.cx+this.carLocal.x,this.z=r.cz+this.carLocal.z,this.yOff=0,this.yaw=0,e.phase=4;let t=this.cur;this.steps.unshift(t),this.steps.unshift({t:`direct`,x:Op.x,z:Op.z}),this.cur=null,this.releaseElev(),this.next()}return 0}return e.phase===4&&this.finishStep(),0}},Ap=class{constructor(e){this.game=e,this.avatar=new Ep(`T董`),this.actor=new kp(e,this.avatar,4,1.2,3.2),this.actor.baseSpeed=2.7,this.actor.speedMul=1,this.avatar.setPose(`stand`),this.key=`T董`,this.title=`T董`,this.elevArmed=!0,this.stairCd=0,this.marker=null,this.moving=!1,this.deckChangeTime=0,this.makeMarker(),this.placeStart()}placeStart(){let e=this.game.ship.decks[4].nav.nearestFree(1.2,3.4)||[1,3];this.actor.place(4,e[0],e[1],-Math.PI/2)}get deck(){return this.actor.deck}makeMarker(){let e=new G(new $a(.28,.4,24).rotateX(-Math.PI/2),new Zr({color:16765803,transparent:!0,opacity:.9,depthWrite:!1}));e.visible=!1,e.renderOrder=6,this.marker=e}showMarker(e,t,n){this.marker.removeFromParent(),this.game.ship.decks[e].group.add(this.marker),this.marker.position.set(t,.06,n),this.marker.visible=!0,this.markerT=0}goTo(e,t,n,r){this.actor.routeTo(e,t,n,r),this.showMarker(e,t,n)}cancelRoute(){this.actor.busy&&(!this.actor.cur||this.actor.cur.t!==`stair`&&this.actor.cur.t!==`elev`)&&this.actor.clear()}useElevator(e){e!==this.deck&&(this.actor.clear(),this.actor.mode=`walk`,this.actor.steps.push({t:`elev`,from:this.deck,to:e}),this.elevArmed=!1,ip(`elevator`,null))}takeStairs(e){let t=e>0?this.deck:this.deck-1;this.actor.clear(),this.actor.steps.push({t:`stair`,k:t,dir:e}),this.stairCd=1}update(e,t,n){let r=this.actor,i=this.game.ship,a=Math.hypot(t.x,t.y),o=r.busy;if(a>.08&&(!r.cur||r.cur.t!==`stair`&&r.cur.t!==`elev`)){o&&r.clear();let s=Math.sin(n),c=Math.cos(n),l=-s*t.y+c*t.x,u=-c*t.y+-s*t.x,d=Math.hypot(l,u);l/=d,u/=d;let f=(t.run?4.6:2.7)*Math.min(1,a),p=i.decks[r.deck].nav.move(r.x,r.z,l*f*e,u*f*e,.26);r.x=p[0],r.z=p[1],r.yaw=Ku(r.yaw,Math.atan2(l,u),14,e),r.speed+=(f-r.speed)*Math.min(1,e*12),this.avatar.speed=r.speed,this.avatar.gait=t.run?`run`:`walk`,r.sync(),this.marker.visible=!1}else o?(r.update(e),this.avatar.speed=r.speed,r.busy||(this.marker.visible=!1)):(r.speed+=(0-r.speed)*Math.min(1,e*10),this.avatar.speed=r.speed,r.sync());if(this.avatar.update(e,this.game.time),this.marker.visible){this.markerT+=e;let t=1+Math.sin(this.markerT*6)*.12;this.marker.scale.setScalar(t)}this.stairCd-=e;let s=r.deck;if(!r.cur||r.cur.t===`walk`){let e=s<4?{x:Z.upTrig,z:$f(s)}:null,t=s>0?{x:Z.downTrig,z:$f(s-1)}:null;a>.08&&this.stairCd<=0&&!r.busy&&(e&&Math.hypot(r.x-e.x,r.z-e.z)<.55?this.takeStairs(1):t&&Math.hypot(r.x-t.x,r.z-t.z)<.55&&this.takeStairs(-1));let n=Math.hypot(r.x-Op.x,r.z-Op.z);n<.7&&this.elevArmed&&!r.busy&&(this.elevArmed=!1,ip(`elevator`,s)),n>1.6&&(this.elevArmed||ip(`elevator`,null),this.elevArmed=!0)}this.moving=r.speed>.2}},jp=[`follow`,`free`,`overview`],Mp={follow:`追隨`,free:`自由`,overview:`全景`},Np=class{constructor(e,t){this.game=e,this.dom=t,this.keys=new Set,this.joy={x:0,y:0},this.pointers=new Map,this.tapCb=null,this.mode=`follow`,this.yaw=.95,this.pitch=.95,this.dist=innerWidth<700?12.5:17,this.target=new V(0,18,0),this.saved={},this.touch=Qu()||new URLSearchParams(location.search).get(`joy`)===`1`,this.rc=new vs,this.tmp=new V,this.pinch=0,this.drag=!1,this.focusBot=null,this.bind()}setMode(e){if(e===this.mode)return;this.saved[this.mode]={yaw:this.yaw,pitch:this.pitch,dist:this.dist,target:this.target.clone()},this.mode=e;let t=this.saved[e];e===`overview`?(this.yaw=.8,this.pitch=.5,this.dist=175,this.tgtOver=new V(0,11,0),this.game.ship.setExplode(0)):e===`follow`?t?(this.yaw=t.yaw,this.pitch=t.pitch,this.dist=t.dist):(this.dist=17,this.pitch=.95):t?(this.yaw=t.yaw,this.pitch=t.pitch,this.dist=t.dist,this.target.copy(t.target)):(this.dist=45,this.pitch=.8),this.focusBot=null,this.game.onModeChange&&this.game.onModeChange(e)}cycleMode(){this.setMode(jp[(jp.indexOf(this.mode)+1)%3])}focusOn(e){let t=e.worldPos(new V);this.setMode(`free`),this.target.copy(t),this.target.y+=1,this.dist=16,this.pitch=.95,this.focusBot=e,this.game.setViewDeck(e.actor.deck)}bind(){let e=this.dom;addEventListener(`keydown`,e=>{if(e.target.tagName===`INPUT`||e.target.tagName===`SELECT`)return;let t=e.key.toLowerCase();this.keys.add(t),t===`v`&&this.cycleMode(),t===`t`&&this.game.togglePause(),(t===`h`||t===`?`)&&this.game.ui&&this.game.ui.toggleHelp(),t===`l`&&this.game.ui&&this.game.ui.toggleCrew(),t>=`1`&&t<=`5`&&!e.ctrlKey&&!e.metaKey&&this.game.ui&&this.game.ui.toggleDeck(t-1),[`arrowup`,`arrowdown`,`arrowleft`,`arrowright`,` `].includes(t)&&e.preventDefault()}),addEventListener(`keyup`,e=>this.keys.delete(e.key.toLowerCase())),addEventListener(`blur`,()=>this.keys.clear()),e.addEventListener(`contextmenu`,e=>e.preventDefault()),e.addEventListener(`pointerdown`,t=>{e.setPointerCapture(t.pointerId),this.pointers.set(t.pointerId,{x:t.clientX,y:t.clientY,sx:t.clientX,sy:t.clientY,t:performance.now(),b:t.button,moved:0}),this.pointers.size===2&&(this.pinch=this.pdist()),this.drag=!1}),e.addEventListener(`pointermove`,e=>{let t=this.pointers.get(e.pointerId);if(!t)return;let n=e.clientX-t.x,r=e.clientY-t.y;if(t.x=e.clientX,t.y=e.clientY,t.moved+=Math.abs(n)+Math.abs(r),this.pointers.size===1)t.moved>7&&(this.drag=!0),this.drag&&(t.b===2||this.mode===`free`&&e.shiftKey?this.pan(n,r):(this.yaw-=n*.0062,this.pitch=Hu(this.pitch+r*.0048,.18,1.5)));else if(this.pointers.size===2){let e=this.pdist();this.pinch>0&&this.zoom(this.pinch/e),this.pinch=e;let[t,i]=[...this.pointers.values()];this.mode===`free`&&this.pan(n*.5,r*.5)}}),e.addEventListener(`pointerup`,e=>{let t=this.pointers.get(e.pointerId);this.pointers.delete(e.pointerId),this.pinch=0,t&&t.moved<8&&performance.now()-t.t<450&&t.b<=0&&this.tapCb&&this.tapCb(e.clientX,e.clientY)}),e.addEventListener(`pointercancel`,e=>{this.pointers.delete(e.pointerId),this.pinch=0}),e.addEventListener(`wheel`,e=>{e.preventDefault(),this.zoom(Math.exp(e.deltaY*.0011))},{passive:!1});let t=document.getElementById(`joy`);if(this.joyEl=t,t){t.style.display=this.touch?`block`:`none`;let e=t.querySelector(`.knob`),n=null,r=n=>{let r=t.getBoundingClientRect(),i=n.clientX-(r.left+r.width/2),a=n.clientY-(r.top+r.height/2),o=Math.hypot(i,a);o>52&&(i=i/o*52,a=a/o*52),e.style.transform=`translate(${i}px,${a}px)`,this.joy.x=i/52,this.joy.y=-a/52};t.addEventListener(`pointerdown`,e=>{n=e.pointerId,t.setPointerCapture(n),r(e),e.stopPropagation()}),t.addEventListener(`pointermove`,e=>{e.pointerId===n&&r(e)});let i=t=>{t.pointerId===n&&(n=null,e.style.transform=``,this.joy.x=0,this.joy.y=0)};t.addEventListener(`pointerup`,i),t.addEventListener(`pointercancel`,i)}}pdist(){let[e,t]=[...this.pointers.values()];return Math.hypot(e.x-t.x,e.y-t.y)||1}zoom(e){let[t,n]=this.mode===`overview`?[60,340]:this.mode===`follow`?[5.5,48]:[4,340];this.dist=Hu(this.dist*e,t,n)}pan(e,t){let n=this.dist*.0016,r=Math.sin(this.yaw),i=Math.cos(this.yaw);this.target.x+=(-i*e-r*t)*n,this.target.z+=(r*e-i*t)*n,this.focusBot=null}get move(){let e=this.keys,t=(e.has(`d`)||e.has(`arrowright`)?1:0)-(e.has(`a`)||e.has(`arrowleft`)?1:0),n=(e.has(`w`)||e.has(`arrowup`)?1:0)-(e.has(`s`)||e.has(`arrowdown`)?1:0);if(t||n){let e=Math.hypot(t,n);t/=e,n/=e}t+=this.joy.x,n+=this.joy.y;let r=Math.hypot(t,n);return r>1&&(t/=r,n/=r),{x:t,y:n,run:e.has(`shift`)||Math.hypot(this.joy.x,this.joy.y)>.92}}pickFloor(e,t){let n=this.game,r=this.dom.getBoundingClientRect(),i=new B((e-r.left)/r.width*2-1,-((t-r.top)/r.height)*2+1);this.rc.setFromCamera(i,n.camera);let a=null;for(let e of n.ship.decks){if(!e.group.visible)continue;e.group.updateWorldMatrix(!0,!1);let t=new Ut().copy(e.group.matrixWorld).invert(),n=this.rc.ray.origin.clone().applyMatrix4(t),r=this.rc.ray.direction.clone().transformDirection(t);if(Math.abs(r.y)<1e-5)continue;let i=-n.y/r.y;if(i<0)continue;let o=n.x+r.x*i,s=n.z+r.z*i;Pd(o,s,e.poly)&&(!a||i<a.t)&&(a={t:i,deck:e.index,x:o,z:s})}return a}update(e){let t=this.game,n=t.camera;if(this.mode===`follow`){let n=t.player.avatar.group.getWorldPosition(this.tmp);n.y+=1.25,this.target.lerp(n,1-Math.exp(-9*e))}else if(this.mode===`overview`)this.target.lerp(this.tgtOver,1-Math.exp(-4*e));else if(this.focusBot){let t=this.focusBot.worldPos(this.tmp);t.y+=1,this.target.lerp(t,1-Math.exp(-6*e))}let r=Math.cos(this.pitch);n.position.set(this.target.x+Math.sin(this.yaw)*r*this.dist,this.target.y+Math.sin(this.pitch)*this.dist,this.target.z+Math.cos(this.yaw)*r*this.dist),n.position.y<1.5&&(n.position.y=1.5),n.lookAt(this.target),n.fov=this.mode===`overview`?40:48,n.updateProjectionMatrix()}},Pp={pp:new no(.04,10,8),pk:new no(.075,12,8)},Fp=class{constructor(e,t,n,r,i,a){this.crew=e,this.kind=t,this.deck=n,this.fac=r,this.a=i,this.b=a,this.state=`gather`,this.done=!1,this.t=0,this.dur=Ju(55,100),this.age=0,this.hitter=i,this.rally=0,this.rallyMax=0,this.pause=0,this.flight=null,this.score=[0,0],this.ball=new G(Pp[t===`pp`?`pp`:`pk`],new go({color:t===`pp`?16777215:15265866,roughness:.5})),this.ball.castShadow=!0,this.ball.visible=!1,e.game.ship.decks[n].group.add(this.ball),this.pos={a:{...r.a},b:{...r.b}},this.sideA=1,this.cur={a:{x:this.pos.a.x,z:this.pos.a.z},b:{x:this.pos.b.x,z:this.pos.b.z}},this.ready=new Set,this.sync()}sync(){this.faceA=this.pos.a.face,this.faceB=this.pos.b.face}stationOf(e){return e===this.a?this.pos.a:this.pos.b}markReady(e){this.ready.add(e),this.ready.size===2&&this.state===`gather`&&(this.state=`play`,this.serve(this.a))}serve(e){this.hitter=e,this.rally=0,this.rallyMax=6+Math.floor(Math.random()*14),this.launch()}launch(){let e=this.hitter,t=e===this.a?this.b:this.a,n=e===this.a?this.cur.a:this.cur.b,r=this.kind===`pp`?.45:1.6,i=(e===this.a?this.pos.b.z:this.pos.a.z)+Ju(-r,r),a=(e===this.a?this.pos.b.x:this.pos.a.x)+(this.kind===`pk`?Ju(-.8,.8):0),o=this.kind===`pp`?1:.95;this.kind,this.flight={t:0,T:this.kind===`pp`?Ju(.5,.7):Ju(.9,1.25),from:{x:n.x+Math.sin(e.actor.yaw)*.4,y:o,z:n.z+Math.cos(e.actor.yaw)*.4},to:{x:a,z:i},H:this.kind===`pp`?.35:.95,hit:!1},t.targetPos={x:a,z:i},e.avatarSwing=!0,e.actor.avatar.swing(),this.ball.visible=!0}cancel(){this.done=!0,this.fac&&(this.fac.taken=null),this.ball.visible=!1,this.ball.removeFromParent()}update(e){if(this.done)return;this.age+=e;for(let[t,n]of[[this.a,`a`],[this.b,`b`]]){if(!t.actor||this.state===`gather`)continue;let r=this.pos[n],i=this.cur[n],a=r.z,o=r.x;t.targetPos&&(a=Math.max(r.z-(this.kind===`pk`?2.2:.5),Math.min(r.z+(this.kind===`pk`?2.2:.5),t.targetPos.z)),this.kind===`pk`&&(o=r.x+Math.max(-.8,Math.min(.8,(t.targetPos.x-r.x)*.3)))),i.z+=(a-i.z)*Math.min(1,e*4),i.x+=(o-i.x)*Math.min(1,e*3),t.actor.x=i.x,t.actor.z=i.z,t.actor.yaw=n===`a`?this.faceA:this.faceB}if(this.state!==`play`)return;if(this.pause>0){if(this.pause-=e,this.pause<=0){if(this.age>this.dur){this.finish();return}this.serve(Math.random()<.5?this.a:this.b)}return}let t=this.flight;if(!t)return;t.t+=e;let n=Math.min(1,t.t/t.T),r=t.from.x+(t.to.x-t.from.x)*n,i=t.from.z+(t.to.z-t.from.z)*n,a=t.from.y+(1-t.from.y)*n+4*t.H*n*(1-n);this.ball.position.set(r,a,i);let o=this.hitter===this.a?this.b:this.a;!t.hit&&t.T-t.t<.22&&(t.hit=!0,o.actor.avatar.swing()),n>=1&&(this.rally++,this.crew.onHit&&this.crew.onHit(this),this.rally>=this.rallyMax||Math.random()<.04?(this.score[+(o===this.a)]++,this.ball.visible=!1,this.flight=null,this.pause=Ju(1.5,2.6),this.crew.onPoint&&this.crew.onPoint(this)):(this.hitter=o,this.launch()))}finish(){this.done=!0,this.fac&&(this.fac.taken=null),this.ball.visible=!1,this.ball.removeFromParent()}},Ip={happy:{icon:`😄`,name:`開心`},focus:{icon:`🎯`,name:`專注`},tired:{icon:`😪`,name:`疲累`},anxious:{icon:`😰`,name:`焦慮`},bored:{icon:`🥱`,name:`無聊`}};Object.keys(Ip);function Lp(e,t){let{nightF:n=0,dayF:r=1,workedMin:i=0,sleeping:a=!1,playing:o=!1}=t,s=e.pnl;if(a)return`tired`;if(e.error)return`anxious`;if(e.kind===`trader`&&s!=null){if(s<=-8&&e.cat===`work`)return`anxious`;if(s>=6)return`happy`}return e.cat===`work`?i>50||n>.7&&i>12?`tired`:e.kind===`trader`&&s!=null&&s<-3?`anxious`:`focus`:e.cat===`rest`?o||e.ageMin<20?`happy`:e.ageMin>55?`bored`:n>.6?`tired`:`happy`:`tired`}var Rp={happy:[`今天心情不錯～`,`海風好舒服。`,`剛完成一件事，爽！`,`哼著歌，慢慢來。`,`生活在方舟也不賴。`,`中午的陽光好溫暖。`],focus:[`專心，別分心。`,`這個問題快解開了。`,`進入心流狀態。`,`再一個小時就好。`,`資料看起來很有趣。`,`先把這段跑完。`],tired:[`好想睡一下…`,`眼睛快睜不開了。`,`咖啡呢？我需要咖啡。`,`腦袋有點轉不動。`,`今天真的有點累。`,`呼…讓我喘口氣。`],anxious:[`這走勢…心跳好快。`,`會不會又被洗出場？`,`手心都是汗。`,`別慌，風控最重要。`,`希望下一根 K 棒是綠的。`,`方舟的未來全靠它了。`],bored:[`好無聊喔…`,`有沒有人要打球？`,`沒事做的時候最難熬。`,`來看看海豚在哪。`,`要不要去吧台坐坐？`,`發呆也是一種放鬆。`]},zp={tired:[`夜深了，只剩星星陪我。`,`好想把頭埋進枕頭。`],happy:[`今晚的星空真美。`],bored:[`夜裡的海好安靜。`],focus:[`夜班模式，安靜好專心。`],anxious:[`夜裡一個人盯盤，壓力更大。`]},Bp=[`權益創新高了！`,`賺錢的感覺真好。`,`今天的倉位很漂亮。`],Vp=[`帳面綠油油…不對是紅的。`,`得想辦法把虧損補回來。`,`停損果然很痛。`];function Hp(e,t,n){let r=[...Rp[e]];return n.nightF>.6&&zp[e]&&r.push(...zp[e],...zp[e]),t.kind===`trader`&&t.pnl!=null&&(t.pnl>3&&r.push(...Bp),t.pnl<-3&&r.push(...Vp)),Yu(r)}var Up=[[`{b}，那份報表你看過了嗎？`,`看過了，數字有點怪，我再核對一下。`,`好，核對完跟我說一聲。`],[`資料來源好像延遲了。`,`我這邊也是，大概是限流。`,`那先用快取頂著。`],[`咖啡續了嗎？`,`第三杯了…`,`別讓老闆看到。`],[`方舟的網路今天特別慢。`,`海浪太大，衛星天線在晃。`,`難怪 ping 一直跳。`],[`這個 bug 到底在哪裡…`,`要不要換個角度看 log？`,`好，我再追一次。`],[`{b}，等下的回測可以一起看嗎？`,`可以，我先把參數整理好。`],[`需求又改了嗎？`,`放心，是小改動。`,`你每次都這樣說。`]],Wp={night:[[`今晚星星好多。`,`對啊，沒有光害，銀河都看得到。`,`難得這麼安靜。`],[`夜裡的海浪聲很催眠。`,`我快睡著了…`],[`月亮好大。`,`像一盞掛在海上的燈。`]],dusk:[[`夕陽真漂亮。`,`這種時刻最適合發呆。`,`明天也要加油。`],[`天空都燒起來了。`,`拍起來存證！`]],dawn:[[`早安！日出了。`,`海面金光閃閃的。`,`新的一天，開工！`],[`今天的日出特別紅。`,`好兆頭。`]],day:[[`今天海很平靜。`,`剛剛有海豚跟著船跳！`,`真的嗎？我也想去看。`],[`太陽好大，記得擦防曬。`,`在海上曬得更快。`],[`剛剛好像看到鯨魚噴水了。`,`哪裡哪裡！`]]},Gp=[[`不知道岸上現在變成怎樣了…`,`別想太多，至少我們有船。`,`是啊，方舟會帶我們走很遠。`],[`看到遠方那些半沉的大樓了嗎？`,`以前那是城市呢。`,`現在成了海鷗的家。`],[`物資還夠嗎？`,`儲藏室滿滿的，放心。`,`那就好。`]],Kp=[[`待會要不要打乒乓球？`,`好啊，輸的請喝飲料。`,`你別手下留情喔。`],[`吧台今天有新口味。`,`是那個海鹽氣泡嗎？`,`對，超好喝。`],[`我剛去跑了兩圈。`,`厲害，我連一圈都撐不住。`,`明天一起練。`],[`泳池水溫剛好。`,`小心別被滑水道噴出去。`,`那是設計的！`],[`今天吃什麼？`,`廚房說是海鮮燉飯。`,`又是海鮮…不過我愛。`],[`你看那邊，飛魚！`,`哇，一大群。`]],qp=[`好球！`,`這球好刁！`,`再來一局？`,`我發球～`,`手感來了！`,`你剛剛出界啦。`,`不錯喔！`,`這分算我的！`,`哇，差一點！`,`換你發球。`,`漂亮！`],Jp=[[`哈，我的曲線比你漂亮。`,`漂亮不能當飯吃，看最後。`,`那就最後見真章。`],[`你又被掃停損了吧？`,`那叫風控，專業的。`,`嘴硬。`],[`要不要賭一杯珍奶？`,`賭！輸的請全船。`,`成交。`],[`你的倉位也太保守了吧。`,`保守才活得久。`,`活得久但賺得少。`],[`別一直盯我的螢幕！`,`我只是剛好路過～`],[`今天行情是我的主場。`,`你每天都這樣說。`]],Yp=[[`競賽現在誰領先？`,`看電視吧，{leader} 目前領先。`,`{loser} 要加油了。`],[`{leader} 領先 {gap}U 耶。`,`還有時間，勝負未定。`]],Xp=[`董事長好！`,`老闆好～`,`T董好！`,`嗨，T董！`,`歡迎視察！`],Zp={night:`董事長還沒休息呀？`,dawn:`T董早安！`,day:`T董午安！`,dusk:`T董晚安～`};function Qp(e,t){return e.replace(/\{(\w+)\}/g,(e,n)=>t[n]??e)}function $p(e,t,n,r,i){let a={b:t.title,a:e.title},o,s=n.phaseKey;if(i===`sport`)return[Yu(qp),Yu(qp)];if(e.kind===`trader`&&t.kind===`trader`&&r){let[n,i]=[r.traders.find(t=>t.name===e.title),r.traders.find(e=>e.name===t.title)];if(n&&i){let e=n.equity>=i.equity?n:i,t=e===n?i:n;a.leader=e.name,a.loser=t.name,a.gap=Math.abs(n.equity-i.equity).toFixed(1)}o=Xu(.55)?Jp:Yp,a.leader||(o=Jp)}else if(i===`work`)o=Xu(.2)?Wp[s]:Xu(.12)?Gp:Up;else{let e=Math.random();if(o=e<.34?Wp[s]:e<.5?Gp:e<.58&&r?Yp:Kp,o===Yp){let e=r.traders;if(e.length>=2){let t=[...e].sort((e,t)=>t.equity-e.equity);a.leader=t[0].name,a.loser=t[1].name,a.gap=(t[0].equity-t[1].equity).toFixed(1)}else o=Kp}}return Yu(o).map(e=>Qp(e,a))}function em(e){return Xu(.35)?Zp[e]:Yu(Xp)}var tm=Math.PI,Q={cabin:0,gym:1,work:2,fun:3,boss:4},nm=(e,t)=>Math.atan2(-e,-t),$=Math.random,rm;function im(){if(rm)return rm;let e=document.createElement(`canvas`);e.width=e.height=64;let t=e.getContext(`2d`),n=t.createRadialGradient(32,32,2,32,32,31);return n.addColorStop(0,`rgba(255,255,255,.95)`),n.addColorStop(1,`rgba(255,255,255,0)`),t.fillStyle=n,t.fillRect(0,0,64,64),rm=new Ei(e),rm}var am=class{constructor(e){this.list=[];for(let t of e.decks)for(let e of t.steams){let n={deck:t,s:e,level:e.cabin?0:.55,target:e.cabin?0:.55,sprites:[]},r=e.cabin?9:4;for(let i=0;i<r;i++){let r=new Wr(new Ar({map:im(),transparent:!0,depthWrite:!1,opacity:0,color:16777215,fog:!0}));r.userData={ph:Math.random(),ox:(Math.random()-.5)*(e.cabin?1.8:.4),oz:(Math.random()-.5)*(e.cabin?2.2:.4),sc:e.cabin?1.6+Math.random()*1.4:.5+Math.random()*.5},r.renderOrder=5,t.group.add(r),n.sprites.push(r)}if(e.cabin){let r=new G(new Qa(2.9,3.3).rotateX(-tm/2),new Zr({color:15331058,transparent:!0,opacity:0,depthWrite:!1}));r.position.set(e.x,2.32,e.z),r.renderOrder=4,t.group.add(r),n.cover=r}this.list.push(n),e.cabin&&(this.byCabin=this.byCabin||{},this.byCabin[e.cabin]=n)}}setCabin(e,t){let n=this.byCabin&&this.byCabin[e];n&&(n.target=+!!t)}update(e,t){for(let n of this.list){n.level+=(n.target-n.level)*(1-Math.exp(-(n.target>n.level?2.5:.35)*e));let r=n.level;n.cover&&(n.cover.material.opacity=Math.min(.94,r*1.15)*+(r>.04));for(let e of n.sprites){let i=e.userData,a=(t*(n.s.cabin?.18:.3)+i.ph)%1;e.position.set(n.s.x+i.ox+Math.sin(t+i.ph*9)*.1,(n.s.cabin?1.2:n.s.y)+a*(n.s.cabin?1.4:1.2),n.s.z+i.oz),e.scale.setScalar(i.sc*(.7+a*.8)),e.material.opacity=r*Math.sin(a*tm)*(n.s.cabin?.55:.4),e.visible=r>.03}}}},om=class{constructor(e,t){this.crew=e,this.game=e.game,this.info=t,this.key=t.key,this.title=t.title,this.kind=t.kind,this.avatar=new Ep(t.key),this.actor=new kp(this.game,this.avatar,Q.work,0,0),this.actor.baseSpeed=1.3+$()*.35,this.gen=null,this.dt=.016,this.claimed=[],this.speech=null,this.mood=`focus`,this.moodTimer=$()*8,this.nextMoodLine=20+$()*40,this.workStart=Date.now()-$()*25*6e4,this.sleeping=!1,this.showered=!1,this.shower=0,this.inBath=!1,this.cabin=null,this.desk=null,this.playing=!1,this.convo=null,this.talkT=0,this.greetCd=0,this.lastChat=-999,this.state=`init`,this.activity=``,this.blanket=null,this.phone=!1}get deckObj(){return this.game.ship.decks[this.actor.deck]}say(e,t=3.4,n=`chat`){this.speech={text:e,until:this.game.time+t,kind:n}}setMoodNow(){let e=this.game.envState;this.mood=Lp(this.info,{nightF:e.nightF,dayF:e.dayF,workedMin:this.info.cat===`work`?(Date.now()-this.workStart)/6e4:0,sleeping:this.sleeping,playing:this.playing})}worldPos(e=new V){return this.avatar.group.getWorldPosition(e)}claim(e){return e?(e.taken=this,this.claimed.push(e),e):null}free(){for(let e of this.claimed)e.taken===this&&(e.taken=null);this.claimed.length=0}pickPoi(e,t,n){let r=(this.game.ship.decks[e].pois.misc[t]||[]).filter(e=>!e.taken&&(!n||n(e)));return r.length?this.claim(Yu(r)):null}*goTo(e,t,n,r,i){for(this.actor.routeTo(e,t,n,{face:r,...i}),yield;this.actor.busy;)yield}*wait(e){let t=0;for(;t<e;)t+=this.dt,yield}*waitUntil(e,t=999){let n=0;for(;!e()&&n<t;)n+=this.dt,yield}*glide(e,t,n,r=0){for(this.actor.steps.push({t:`glide`,x:e,z:t,yaw:n,y:r}),yield;this.actor.busy;)yield}pose(e,t=null){this.avatar.setPose(e),this.avatar.hold(t)}cleanup(){this.free(),this.avatar.hold(null),this.avatar.group.visible=!0,this.actor.clear(),this.actor.locked=!1,this.actor.mode=`walk`,this.avatar.body.rotation.x=0,this.avatar.setPose(`stand`),this.avatar.speed=0,this.avatar.fixedSpeed=null,this.avatar.fixedGait=null,this.playing=!1,this.match&&(this.match.cancel(),this.match=null),this.targetPos=null,this.inBath=!1,this.blanket&&(this.blanket.visible=!1),this.crew.fx.setCabin(this.title,!1),this.cabin&&this.cabin.bathDoor.set(!0),this.sleeping||this.avatar.robe.visible,this.sleeping=!1,this.actor.yOff=0}restart(){this.cleanup(),this.gen=this.run()}*run(){let e=this.info.cat;this.state=e,e!==`off`&&!this.wasSleeping&&this.avatar.setRobe(!1),this.wasSleeping&&(yield*this.wake()),e===`work`?(this.workStart=Date.now()-$()*3*6e4,yield*this.workLoop()):e===`rest`?yield*this.restLoop():yield*this.offLoop()}*wake(){this.wasSleeping=!1;let e=this.cabin;if(e){let t=e.bed;yield*this.glide(t.x+1.35,t.z-e.side*1.2,t.face,0)}if(this.avatar.setRobe(!1),this.avatar.setPose(`stand`),this.actor.avatar.body.rotation.x=0,this.pose(`stretch`),yield*this.wait(1.6),this.pose(`stand`),e)for(this.actor.routeTo(0,e.door.x,e.door.z,{});this.actor.busy;)yield}*workLoop(){let e=this.crew.deskFor(this);this.desk=e,e&&(yield*this.goTo(Q.work,e.x,e.z,e.face));let t=55+$()*70;for(;;){e?(yield*this.glide(e.x,e.z,e.face,0),this.pose(`type`),e.screen&&e.screen.color.set(2779802)):this.pose(`stand`);let n=0,r=25+$()*45;for(;n<r;)n+=this.dt,yield,e&&$()<.0025&&(this.pose(`think`),yield*this.wait(3+$()*4),this.pose(`type`)),this.game.crewRule&&this.game.crewRule.fastBreak&&(n+=this.dt*6);t-=r,t<0&&(t=(this.game.envState.nightF>.6?110:60)+$()*80,e&&e.screen&&e.screen.color.set(1389130),yield*this.breakTime())}}*breakTime(){let e=$(),t=this.game.ship.decks[Q.work].pois.misc;if(this.activity=`休息一下`,e<.28&&t.coffee){let e=t.coffee[0];yield*this.goTo(Q.work,e.x,e.z,e.face),this.pose(`drink`,`mug`),yield*this.wait(8+$()*6)}else if(e<.5&&t.cooler){let e=Yu(t.cooler);yield*this.goTo(Q.work,e.x,e.z,e.face),this.pose(`drink`,`mug`),yield*this.wait(6+$()*5)}else if(e<.66&&t.whiteboard){let e=t.whiteboard[0];yield*this.goTo(Q.work,e.x,e.z,e.face),this.pose(`think`),this.pose(`stand`),yield*this.wait(8+$()*6)}else if(e<.82){let e=Yu(t.rail);yield*this.goTo(Q.work,e.x,e.z,e.face),this.pose(`rail`),yield*this.wait(10+$()*8)}else{let e=Yu(t.chat);yield*this.goTo(Q.work,e.x,e.z,$()*6),this.pose(`stretch`),yield*this.wait(4),this.pose(`chat`),yield*this.wait(8+$()*8)}this.pose(`stand`),this.avatar.hold(null),this.free()}*restLoop(){for(;;){let e=this.game.envState.nightF>.6,t=[],n=this.crew.findPartner(this);n&&!e?t.push([`match`,4.2]):n&&t.push([`match`,1.5]),t.push([`arcade`,1.6],[`bar`,e?2.6:1.2],[`lounge`,e?2:1.4],[`swim`,e?.2:1.5],[`tub`,e?2:.8],[`treadmill`,1],[`bench`,.8],[`jog`,e?.2:1.2],[`hoop`,e?.2:1.4],[`eat`,1.1],[`chat`,2],[`rail`,e?2.4:1],[`tv`,.9],[`coffee`,.6]);let r=t.reduce((e,t)=>e+t[1],0),i=$()*r,a=`chat`;for(let[e,n]of t)if(i-=n,i<=0){a=e;break}this.activity=a,yield*this[`act_`+a](n),this.pose(`stand`),this.avatar.hold(null),this.free(),this.actor.yOff=0,this.avatar.body.rotation.x=0,yield*this.wait(1+$()*3)}}*standAt(e,t,n,r){yield*this.goTo(e.deckIdx??this.curDeck,e.x,e.z,e.face),this.pose(t,r),yield*this.wait(n)}*act_arcade(){let e=this.pickPoi(Q.fun,`arcade`);e&&(yield*this.goTo(Q.fun,e.x,e.z,e.face),yield*this.glide(e.x,e.z,e.face),this.pose(`arcade`),yield*this.wait(18+$()*24))}*act_bar(){let e=this.pickPoi(Q.fun,`stool`);e&&(yield*this.goTo(Q.fun,e.x,e.z,e.face),yield*this.glide(e.x,e.z-.12,e.face,.2),this.pose(`eat`,`mug`),yield*this.wait(16+$()*20),this.actor.yOff=0,yield*this.glide(e.x,e.z-.3,e.face,0))}*act_lounge(){let e=this.pickPoi(Q.fun,`lounger`)||this.pickPoi(Q.boss,`lounger`);if(!e)return;e.__d??Q.fun;let t=this.crew.findPoiDeck(e);yield*this.goTo(t,e.x,e.z+(e.head[1]?-e.head[1]*1.3:0),e.face);let n=e.head[0],r=e.head[1];yield*this.glide(e.x-n*.85,e.z-r*.85,nm(n,r),.42),this.pose(`lounge`),yield*this.wait(22+$()*30),this.pose(`stand`),yield*this.glide(e.x-n*1.6+r*0,e.z-r*1.6,e.face,0)}*act_tub(){let e=this.pickPoi(Q.boss,`tub`);e&&(yield*this.goTo(Q.boss,e.x-2.7,e.z,tm/2),yield*this.glide(e.x+($()-.5)*1,e.z+($()-.5)*1.2,-tm/2+($()-.5),-.18),this.pose(`sit`),this.pose(`eat`),yield*this.wait(20+$()*25),this.pose(`stand`),yield*this.glide(e.x-2.7,e.z,tm/2,0))}*act_swim(e){let t=this.game.ship.decks[Q.fun].pois.misc.pool;if(!t)return;Yu(t),yield*this.goTo(Q.fun,-17.5,5.4,tm),this.pose(`stand`),yield*this.wait(.5);let n=[[-18.6,2],[-10.4,2],[-10.4,-2.2],[-18.6,-2.2]].map(([e,t])=>({x:e,z:t}));yield*this.glide(n[0].x,n[0].z,tm/2,.12),this.pose(`swim`);let r=2+Math.floor($()*2);for(this.actor.mode=`walk`,this.actor.steps.push({t:`follow`,pts:n,laps:r,speed:1,start:1}),this.actor.yOffSwim=!0,yield;this.actor.busy;)this.actor.yOff=.12,yield;this.pose(`stand`),yield*this.glide(-17.5,5.4,tm,0)}*act_treadmill(){let e=this.pickPoi(Q.gym,`treadmill`);if(!e)return;yield*this.goTo(Q.gym,e.x,e.z,e.face),yield*this.glide(e.x,e.z,e.face),this.pose(`stand`),this.avatar.gait=`run`,this.actor.mode=`run`;let t=this.game.time,n=18+$()*20;for(this.avatar.fixedSpeed=2.6,this.avatar.fixedGait=`run`;this.game.time-t<n;)yield;this.avatar.fixedSpeed=null,this.avatar.fixedGait=null,this.avatar.speed=0,this.actor.mode=`walk`,this.actor.speed=0}*act_bench(){let e=this.pickPoi(Q.gym,`bench`);e&&(yield*this.goTo(Q.gym,e.x,e.z+1.3,e.face+tm),yield*this.glide(e.x,e.z+1,tm,0),this.pose(`lift`),yield*this.wait(16+$()*18))}*act_jog(){let e=this.game.ship.decks[Q.gym].pois.track;if(!e)return;let t=0,n=1e9;for(e.forEach((e,r)=>{let i=Math.hypot(e.x-this.actor.x,e.z-this.actor.z);i<n&&(n=i,t=r)}),yield*this.goTo(Q.gym,e[(t+4)%e.length].x,e[(t+4)%e.length].z,0,{}),this.actor.mode=`run`,this.actor.steps.push({t:`follow`,pts:e,laps:1+$()*1.4,speed:2.8,start:(t+4)%e.length}),yield;this.actor.busy;)yield;this.actor.mode=`walk`,this.pose(`stand`),yield*this.wait(3)}*act_hoop(){let e=this.game.ship.decks[Q.gym].pois.misc.hoop;if(!e)return;let t=e[0],n=this.crew.getBall(Q.gym);yield*this.goTo(Q.gym,t.x,t.z,t.face),this.avatar.hold(`ball`),n.visible=!1;let r=4+Math.floor($()*4);for(let e=0;e<r;e++){this.pose(`stand`),yield*this.wait(1.2+$()),this.pose(`shoot`),yield*this.wait(.45),this.avatar.hold(null),n.visible=!0;let e=t.hoop,r=this.game.time,i=1.15,a=this.actor.x,o=this.actor.z,s=Xu(.4);for(;this.game.time-r<i;){let t=(this.game.time-r)/i,c=e.x-(s?.5:0),l=e.z+(s?.3:0);n.position.set(a+(c-a)*t,2.05+(e.y-2.05)*t+5.2*t*(1-t),o+(l-o)*t),yield}let c=this.game.time;for(;this.game.time-c<.55;){let t=(this.game.time-c)/.55;n.position.y=e.y*(1-t*t)+.12,n.position.x+=(s?.8:0)*this.dt,yield}this.pose(`stand`),n.visible=!1,this.avatar.hold(`ball`),s?Xu(.5)&&this.say(`可惜…`,1.8,`chat`):this.say(`進！`,1.8,`chat`)}this.avatar.hold(null),n.visible=!1}*act_eat(){let e=this.pickPoi(Q.cabin,`canteen`);e&&(yield*this.goTo(Q.cabin,e.x,e.z,e.face),yield*this.glide(e.x,e.z,e.face),this.pose(`eat`),yield*this.wait(18+$()*16),this.pose(`stand`))}*act_chat(){let e=Yu([`fun`,`cabin`,`work`,`fun`,`gym`].map(e=>e)),t={fun:Q.fun,cabin:Q.cabin,work:Q.work,gym:Q.gym}[e],n=this.game.ship.decks[t].pois.misc.chat;if(!n||!n.length)return;let r=n.find(e=>!e.taken)||Yu(n);this.claim(r),yield*this.goTo(t,r.x,r.z,$()*6),this.pose(`chat`),this.avatar.talk=.3,yield*this.wait(14+$()*16)}*act_rail(){let e=Yu([Q.fun,Q.cabin,Q.work,Q.gym]),t=this.game.ship.decks[e].pois.misc.rail;if(!t)return;let n=Yu(t);yield*this.goTo(e,n.x,n.z,n.face),this.pose(`rail`),yield*this.wait(14+$()*18)}*act_tv(){yield*this.goTo(Q.work,27.7,$()<.5?-1.2:1.2,-tm/2),this.pose(`stand`),this.avatar.talk=0,yield*this.wait(14+$()*14)}*act_coffee(){let e=this.game.ship.decks[Q.work].pois.misc.coffee;e&&(yield*this.goTo(Q.work,e[0].x,e[0].z,e[0].face),this.pose(`drink`,`mug`),yield*this.wait(10))}*act_match(e){if(!e||e.info.cat!==`rest`||e.match||e.state===`init`)return;let t=[],n=this.game.ship.decks[Q.gym].pois,r=(n.misc.pingpong||[]).filter(e=>!e.taken);if(r.length&&t.push(`pp`),n.pickle&&!n.pickle.taken&&t.push(`pk`),!t.length)return;let i=Yu(t),a=i===`pp`?Yu(r):n.pickle;a.taken=this;let o=new Fp(this.crew,i,Q.gym,a,this,e);this.crew.matches.push(o),e.match=o,this.match=o,e.matchRole=`b`,e.joinMatch(o),yield*this.playMatch(o,`a`),a.taken=null}joinMatch(e){this.interrupt(function*(t){yield*t.playMatch(e,`b`)})}*playMatch(e,t){this.match=e,this.playing=!0;let n=t===`a`?e.pos.a:e.pos.b;this.actor.mode=`walk`,yield*this.goTo(Q.gym,n.x,n.z,n.face),this.avatar.hold(`racket`),this.pose(`swing`),this.actor.x=n.x,this.actor.z=n.z,this.actor.yaw=n.face,e.markReady(this),this.info.matchFrom=this.game.time,yield*this.waitUntil(()=>e.done,400),this.avatar.hold(null),this.playing=!1,this.match=null,this.pose(`wave`),yield*this.wait(1.8),this.pose(`stand`),(t===`a`||$()<.5)&&this.say(Yu([`打得真過癮！`,`下次我會贏你。`,`好久沒這麼痛快了！`,`喝杯水休息一下。`]),3)}interrupt(e){this.cleanup(),this.gen=(function*(t){yield*e(t),t.restartAfter=!0})(this)}*offLoop(){let e=this.crew.cabinFor(this);if(this.cabin=e,!e){let e=this.pickPoi(Q.fun,`lounger`);if(e){yield*this.goTo(Q.fun,e.x,e.z-e.head[1]*1.3,e.face);let t=e.head[0],n=e.head[1];for(yield*this.glide(e.x-t*.85,e.z-n*.85,nm(t,n),.42),this.pose(`lounge`),this.sleeping=!0;;)yield}}else for(this.activity=`下班`,yield*this.goTo(Q.cabin,e.door.x,e.door.z,0),(!this.showered||$()<.15)&&(yield*this.takeShower(e)),yield*this.goBed(e);;)yield}*takeShower(e){for(this.activity=`洗澡`,yield*this.goTo(Q.cabin,e.bathOut.x,e.bathOut.z,tm/2),e.bathDoor.set(!0),yield*this.waitUntil(()=>e.bathDoor.opened(),3),this.actor.steps.push({t:`direct`,x:e.bathIn.x,z:e.bathIn.z}),yield;this.actor.busy;)yield;for(this.actor.yaw=tm/2*1,yield*this.wait(.5),e.bathDoor.set(!1),yield*this.waitUntil(()=>e.bathDoor.closed(),3),this.avatar.group.visible=!1,this.inBath=!0,this.crew.fx.setCabin(this.title,!0),yield*this.wait(12+$()*8),this.crew.fx.setCabin(this.title,!1),this.avatar.setRobe(!0),this.avatar.group.visible=!0,this.inBath=!1,this.pose(`stand`),this.actor.x=e.bathIn.x,this.actor.z=e.bathIn.z,e.bathDoor.set(!0),yield*this.waitUntil(()=>e.bathDoor.opened(),3),this.actor.steps.push({t:`direct`,x:e.bathOut.x,z:e.bathOut.z}),yield;this.actor.busy;)yield;this.showered=!0,this.say(Yu([`洗完澡好舒服～`,`呼，清爽！`,`準備睡覺了。`]),3),this.pose(`stretch`),yield*this.wait(1.4),this.pose(`stand`)}*goBed(e){let t=e.bed;this.activity=`睡覺`,yield*this.goTo(Q.cabin,t.x+1.35,t.z-e.side*1.2,t.face),this.enterBed(e,!0)}enterBed(e,t){let n=e.bed,r=e.side;if(this.sleeping=!0,this.wasSleeping=!0,this.pose(`lie`),this.avatar.group.visible=!0,this.actor.steps.length=0,this.actor.cur=null,this.actor.place(Q.cabin,n.x,n.z-r*.8,nm(0,r)),this.actor.yOff=.7,!this.blanket){let e=new G(new K(1.25,.14,1.15),new go({color:this.avatar.look.shirt,roughness:.95}));e.castShadow=!0,this.game.ship.decks[Q.cabin].group.add(e),this.blanket=e}this.blanket.position.set(n.x,.9,n.z-r*.38),this.blanket.visible=!0}},sm=class{constructor(e){this.game=e,this.bots=new Map,this.matches=[],this.fx=new am(e.ship),this.balls={},this.chatT=1,this.pairCd=new Map,this.deskUsed=new Set,this.deskExtra=0,this.cabinUsed=new Set,this.onHit=()=>{},this.onPoint=e=>{e.score,$()<.5&&($()<.5?e.a:e.b).say(Yu([`好球！`,`漂亮！`,`再來一局？`,`這分算我的！`]),2.4)}}getBall(e){if(!this.balls[e]){let t=new G(new no(.12,14,10),new go({color:14250795,roughness:.8}));t.castShadow=!0,t.visible=!1,this.game.ship.decks[e].group.add(t),this.balls[e]=t}return this.balls[e]}findPoiDeck(e){for(let t of this.game.ship.decks)for(let n in t.pois.misc){let r=t.pois.misc[n];if(Array.isArray(r)&&r.includes(e))return t.index}return Q.fun}deskFor(e){let t=this.game.ship.decks[Q.work].pois,n=t.desks.find(t=>t.key===e.key);if(n)return n;let r=t.extraDesks.find(e=>!this.deskUsed.has(e.key));return r?(this.deskUsed.add(r.key),r):null}cabinFor(e){return this.game.ship.decks[Q.cabin].pois.cabins[e.key]||null}findPartner(e){let t=[...this.bots.values()].filter(t=>t!==e&&t.info.cat===`rest`&&!t.match&&!t.playing&&t.state===`rest`&&t.activity!==`swim`);return t.length?Yu(t):null}applyData(e){this.data=e,this.arena=e.arena,e.arena&&this.game.tv.setArena(e.arena);let t=new Set;for(let n of e.crew){t.add(n.key);let e=this.bots.get(n.key);if(!e)e=new om(this,n),this.bots.set(n.key,e),this.spawn(e);else{let t=e.info.cat!==n.cat;e.info=n,t&&e.restart()}}for(let[e,n]of this.bots)t.has(e)||(n.cleanup(),n.avatar.group.removeFromParent(),this.bots.delete(e));ip(`crew`,[...this.bots.values()])}spawn(e){let t=e.info,n=this.game.ship;if(e.state=t.cat,e.setMoodNow(),t.cat===`work`){let t=this.deskFor(e);e.desk=t,t&&(e.actor.place(Q.work,t.x,t.z,t.face),e.pose(`type`),t.screen&&t.screen.color.set(2779802)),e.gen=e.run()}else if(t.cat===`rest`){let t=Yu(n.decks[Q.fun].pois.misc.chat);e.actor.place(Q.fun,t.x+($()-.5)*3,t.z+($()-.5)*3,$()*6),e.pose(`stand`),e.gen=e.run()}else{let t=this.cabinFor(e);e.cabin=t,t?(e.showered=!0,e.avatar.setRobe(!0),e.enterBed(t),e.state=`off`,e.gen=(function*(){for(;;)yield})()):e.gen=e.run()}}update(e,t){for(let n of this.bots.values())n.dt=e,n.gen&&n.gen.next().done&&(n.gen=null,n.restartAfter&&(n.restartAfter=!1,n.restart())),n.actor.update(e),n.avatar.update(e,t),n.avatar.talk+=((n.convo?1:n.avatar.talk>.3?.3:0)-n.avatar.talk)*Math.min(1,e*4),n.moodTimer-=e,n.moodTimer<=0&&(n.moodTimer=4,n.setMoodNow()),n.nextMoodLine-=e,n.nextMoodLine<=0&&(n.nextMoodLine=45+$()*75,(!n.speech||n.speech.until<t)&&(n.inBath||n.say(Hp(n.mood,n.info,this.game.envState),4.5,`mood`))),n.speech&&n.speech.until<t&&(n.speech=null),n.greetCd>0&&(n.greetCd-=e);for(let t=this.matches.length-1;t>=0;t--){let n=this.matches[t];n.update(e),n.done&&this.matches.splice(t,1)}this.fx.update(e,t),this.updateChat(e,t),this.updateGreet(t)}updateChat(e,t){if(this.chatT-=e,this.chatT>0)return;this.chatT=1.2;let n=[...this.bots.values()].filter(e=>!e.sleeping&&!e.inBath&&e.actor.speed<.3&&!e.convo&&e.state!==`init`&&!(e.actor.cur&&e.actor.cur.t===`stair`)&&!e.actor.inCar);for(let e=0;e<n.length;e++)for(let r=e+1;r<n.length;r++){let i=n[e],a=n[r];if(i.actor.deck!==a.actor.deck||Math.hypot(i.actor.x-a.actor.x,i.actor.z-a.actor.z)>(i.info.cat===`work`&&a.info.cat===`work`?6.8:4.2))continue;let o=i.key<a.key?i.key+`|`+a.key:a.key+`|`+i.key;if(t<(this.pairCd.get(o)||0))continue;let s=i.kind===`trader`&&a.kind===`trader`,c=s?.45:i.info.cat===`work`&&a.info.cat===`work`?.1:.3;if(this.pairCd.set(o,t+(s?40:70)+$()*50),$()>c||i.playing||a.playing)continue;let l=i.info.cat===`work`&&a.info.cat===`work`?`work`:`leisure`;this.startConvo(i,a,$p(i.info,a.info,this.game.envState,this.arena,l))}for(let e of this.matches)if(e.state===`play`&&$()<.18){let t=$()<.5?e.a:e.b;t.convo||t.speech&&t.speech.kind===`chat`||t.say(Yu([`好球！`,`這球好刁！`,`我發球～`,`手感來了！`,`不錯喔！`,`差一點！`,`換你發球。`,`漂亮！`]),2.2)}}startConvo(e,t,n){let r=[e,t];e.convo=t.convo={t:0};let i=e=>e.actor.avatar.poseName===`stand`||e.actor.avatar.poseName===`chat`;i(e)&&!e.actor.busy&&(e.actor.yaw=Math.atan2(t.actor.x-e.actor.x,t.actor.z-e.actor.z)),i(t)&&!t.actor.busy&&(t.actor.yaw=Math.atan2(e.actor.x-t.actor.x,e.actor.z-t.actor.z)),e.avatar.poseName===`stand`&&e.avatar.setPose(`chat`),t.avatar.poseName===`stand`&&t.avatar.setPose(`chat`),n.forEach((i,a)=>setTimeout(()=>{let o=r[a%2];!o.sleeping&&!o.inBath&&o.convo&&o.say(i,3.2,`chat`),a===n.length-1&&setTimeout(()=>{e.convo=t.convo=null,e.avatar.poseName===`chat`&&e.state},2500)},a*3.4*1e3))}updateGreet(e){let t=this.game.player;if(t)for(let e of this.bots.values())e.actor.deck!==t.actor.deck||e.greetCd>0||e.sleeping||e.inBath||e.convo||Math.hypot(e.actor.x-t.actor.x,e.actor.z-t.actor.z)<2.6&&t.actor.speed<3&&(e.greetCd=90+$()*60,e.say(em(this.game.phaseKey),3.4,`greet`),e.avatar.poseName===`stand`&&!e.actor.busy&&(e.actor.yaw=Math.atan2(t.actor.x-e.actor.x,t.actor.z-e.actor.z),e.avatar.setPose(`wave`),setTimeout(()=>{e.avatar.poseName===`wave`&&e.avatar.setPose(`stand`)},2200)))}},cm=new Set([`thinking`,`tool`,`typing`,`waiting`,`error`]);function lm(e){let t=e.now||e.generatedAt||Date.now(),n=e.arena&&Array.isArray(e.arena.traders)?{updated:e.arena.updated||t,traders:e.arena.traders.map(e=>({name:String(e.name),start:+e.start||100,equity:+e.equity||0,series:Array.isArray(e.series)?e.series.filter(e=>Array.isArray(e)).map(e=>[+e[0],+e[1]]).slice(-160):[]}))}:null,r=[];for(let i of e.sessions||[]){if(i.subagent)continue;let e=String(i.title||i.project||i.agent||`?`).slice(0,24),a=i.bot&&i.bot.kind||`other`,o=String(i.status||`idle`),s=+i.lastEventAt||+i.turnStartedAt||t,c=Math.max(0,(t-s)/6e4),l;l=cm.has(o)?`work`:o===`idle`&&c<30||(o===`done`||o===`interrupted`)&&c<90?`rest`:`off`;let u={key:e,title:e,kind:a,status:o,cat:l,ageMin:c,error:o===`error`,since:+i.turnStartedAt||s};if(a===`trader`&&n){let t=n.traders.find(t=>t.name===e);if(t){u.equity=t.equity,u.start=t.start,u.pnl=(t.equity-t.start)/t.start*100;let e=/(\d+)\s*倉/.exec(String(i.activity||``));u.pos=e?+e[1]:null}}r.push(u)}return{now:t,crew:r,arena:n,offline:!1}}var um=[[`最高級打工仔`,`manager`],[`交易員-1`,`trader`],[`交易員-2`,`trader`],[`0xcat`,`research`],[`策略研究員`,`research`],[`鏈上獵手`,`research`]];function dm(e=0,t=!1){let n=Date.now(),r={updated:n,traders:[[`交易員-1`,0],[`交易員-2`,1]].map(([e,t])=>{let r=[],i=100;for(let e=0;e<80;e++)i+=Math.sin(e*.3+t*2)*1.6+Math.cos(e*.11+t)*1.1-.05,r.push([n-(80-e)*9e5,i]);return{name:e,start:100,equity:i,series:r}})},i=[`work`,`rest`,`off`];return{now:n,crew:um.map(([a,o],s)=>{let c=t?i[(Math.floor(e)+s)%3]:[`work`,`work`,`work`,`rest`,`rest`,`off`][s],l=r.traders.find(e=>e.name===a);return{key:a,title:a,kind:o,status:c===`work`?`tool`:c===`rest`?`done`:`idle`,cat:c,ageMin:c===`rest`?12:600,since:n-6e5,...l?{equity:l.equity,start:100,pnl:l.equity-100,pos:1}:{}}}),arena:r,offline:!0,demo:!0}}var fm=class{constructor(e={}){this.url=e.url||`https://tim164863-hue.github.io/grokbot-office/sessions.json`,this.every=e.every||45e3,this.data=null,this.lastOk=0,this.mode=e.mode||`live`,this.demoTick=0,this.listeners=[]}onData(e){this.listeners.push(e)}push(e){this.data=e;for(let t of this.listeners)t(e);ip(`data`,e)}async fetchOnce(){try{let e=await fetch(this.url+`?t=`+Date.now(),{cache:`no-store`});if(!e.ok)throw Error(`http `+e.status);let t=await e.json();return this.lastOk=Date.now(),this.push(lm(t)),!0}catch{return this.data?Date.now()-this.lastOk>3e5&&!this.data.offline&&this.push({...this.data,offline:!0}):this.push(dm(0,!1)),!1}}start(){this.mode===`cycle`?(this.push(dm(0,!0)),setInterval(()=>{this.demoTick++,this.push(dm(this.demoTick,!0))},3e4)):this.mode===`demo`?this.push(dm(0,!1)):(this.fetchOnce(),setInterval(()=>this.fetchOnce(),this.every))}},pm=class{constructor(e){let t=td();this.qLevel=t.level,this.qLocked=t.locked,this.quality=$u[this.qLevel],this.canvas=e,this.renderer=new Vu({canvas:e,antialias:this.quality.dpr>1,powerPreference:`high-performance`}),this.renderer.toneMapping=4,this.renderer.outputColorSpace=Je,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=2,this.scene=new Dn,this.camera=new Zo(50,1,.3,9e3),this.time=0,this.clock=new xs,this.env=new cd(this.scene,this.renderer,this.quality),this.ocean=new _d(this.scene,this.env,this.quality),this.tv=new np,this.ship=new tp(this.env,this.quality,this.tv.tex),this.scene.add(this.ship.root),this.dayT=.7,this.dayRate=1/1800,this.speed=1,this.paused=!1,this.focus=new V(0,8,0),this.ctx=this,this.fps=60,this.fpsAcc=0,this.fpsN=0,this.lowCount=0,this.deckPref=[null,null,null,null,null],this.viewDeck=4,this.viewOverride=null,this.envState=this.env.update(this.dayT,0,this.camera,this.focus),this.updatePhase(),this.sealife=new gp(this.scene,this.env,this.quality),this.player=new Ap(this),this.crew=new sm(this),this.controls=new Np(this,e),this.controls.tapCb=(e,t)=>this.onTap(e,t);let n=new URLSearchParams(location.search);this.ds=new fm({mode:n.get(`demo`)===`cycle`?`cycle`:n.get(`demo`)?`demo`:`live`}),this.ds.onData(e=>{this.dataInfo=e,this.crew.applyData(e)}),this.resize(),addEventListener(`resize`,()=>this.resize())}resize(){let e=innerWidth,t=innerHeight;this.W=e,this.H=t,this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,this.quality.dpr)),this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix()}setQuality(e){this.qLevel=e,this.quality=$u[e],this.env.setQuality(this.quality),this.ocean.build(this.quality),this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,this.quality.dpr)),this.renderer.setSize(this.W,this.H,!1),this.scene.traverse(e=>{e.material&&(e.material.needsUpdate=!0)})}updatePhase(){let e=this.envState;this.phaseKey=e.nightF>.6?`night`:e.duskF>.5?this.dayT>.5?`dusk`:`dawn`:`day`,e.phaseKey=this.phaseKey}togglePause(){this.paused=!this.paused,ip(`time`,null)}setTime(e){this.dayT=(e%1+1)%1}setViewDeck(e){this.viewOverride=e}deckAtY(e){return Math.max(0,Math.min(4,Math.floor((e-Kf+.9)/(Gf+this.ship.explode))))}updateDecks(){let e=this.controls,t;t=e.mode===`follow`?this.player.deck:e.mode===`free`?this.viewOverride!=null&&e.focusBot?e.focusBot.actor.deck:this.deckAtY(e.target.y):4,this.viewDeck=t;let n=this.deckPref.map((n,r)=>n??(e.mode===`overview`||r<=t));this.ship.setVisibleDecks(n),this.deckVis=n}onTap(e,t){let n=this.controls.pickFloor(e,t);n&&this.player.goTo(n.deck,n.x,n.z)}step(e){this.paused||(this.dayT=(this.dayT+e*this.dayRate*this.speed)%1),this.time+=e;let t=Math.min(e,.1);this.ocean.update(this.time,1),this.ship.update(t,this.time),this.player.update(t,this.controls.move,this.controls.yaw),this.crew.update(t,this.time),this.updateDecks(),this.controls.update(t),this.focus.copy(this.controls.mode===`overview`?this.controls.tgtOver:this.controls.target);let n=this.envState=this.env.update(this.dayT,this.time,this.camera,this.focus);this.updatePhase(),this.sealife.update(t,this.time,n),this.tv.update(t);for(let t of op)t.update(e,this);return e<.5&&(this.fpsAcc+=e,this.fpsN++,this.fpsAcc>=1&&(this.fps=this.fpsN/this.fpsAcc,this.fpsAcc=0,this.fpsN=0,this.autoQuality())),n}autoQuality(){if(!(this.qLocked||document.hidden||this.time<6)&&(this.fps<26?this.lowCount++:this.lowCount=Math.max(0,this.lowCount-1),this.lowCount>=4)){this.lowCount=0;let e=ed.indexOf(this.qLevel);e<ed.length-1&&(this.setQuality(ed[e+1]),ip(`quality`,this.qLevel))}}selfTest(){let e=[];return this.ship.decks.forEach(t=>{let n=t.nav,r=[];t.index<4&&r.push([`up`,Dp(t.index,1)]),t.index>0&&r.push([`dn`,Dp(t.index-1,-1)]),r.push([`elev`,Op]);let i=[],a=(e,t)=>{t&&typeof t.x==`number`&&typeof t.z==`number`&&i.push([e,t])};for(let e in t.pois.misc){let n=t.pois.misc[e];Array.isArray(n)?n.forEach((t,n)=>a(e+n,t)):a(e,n)}(t.pois.desks||[]).forEach(e=>a(`desk`+e.key,e));for(let e in t.pois.cabins||{}){let n=t.pois.cabins[e];a(`cabin.`+e+`.corridor`,n.corridor),a(`cabin.`+e+`.bathIn`,n.bathIn),a(`cabin.`+e+`.bathOut`,n.bathOut)}let o=r[0][1];for(let[r,a]of i){let i=n.findPath(o.x,o.z,a.x,a.z),s=i&&i[i.length-1];(!i||Math.hypot(s[0]-a.x,s[1]-a.z)>1.3)&&e.push(`${t.name}:${r} (${a.x.toFixed(1)},${a.z.toFixed(1)}) ${i?`終點偏差`:`無路徑`}`)}for(let[i,a]of r)n.free(n.ix(a.x),n.iz(a.z))||e.push(`${t.name}:${i} 入口不可走 (${a.x},${a.z})`)}),e}render(){this.renderer.render(this.scene,this.camera)}},mm={match:`打球對戰`,arcade:`玩街機`,bar:`吧台小酌`,lounge:`躺椅曬/看星`,swim:`泳池游泳`,tub:`泡按摩池`,treadmill:`跑步機`,bench:`重訓`,jog:`操場慢跑`,hoop:`投籃`,eat:`吃飯`,chat:`聊天`,rail:`看海`,tv:`看比賽直播`,coffee:`喝咖啡`},hm={work:[`工作中`,`#5fd08a`],rest:[`休息中`,`#ffd36b`],off:[`下班`,`#8aa0b8`]},gm={night:`🌙 夜`,dawn:`🌅 黎明`,day:`☀️ 白天`,dusk:`🌇 黃昏`},_m=e=>{let t=document.createElement(`template`);return t.innerHTML=e.trim(),t.content.firstElementChild},vm=class{constructor(e){this.game=e,this.root=document.getElementById(`ui`),this.labelRoot=document.getElementById(`labels`),this.labels=new Map,this.build(),ap(`crew`,()=>this.renderList()),ap(`elevator`,e=>this.showElevator(e)),ap(`time`,()=>this.syncTime()),ap(`quality`,e=>{this.qsel.value=`auto`,this.toast(`畫質自動降為 `+e)}),e.ui=this,e.onModeChange=e=>{this.camBtn.textContent=`🎥 `+Mp[e],this.refreshDeckBtns()},setInterval(()=>this.renderList(!0),1e3)}build(){let e=this.game,t=this.root;t.innerHTML=``,this.top=_m(`<div id="top"><div class="brand"><b>末日方舟</b><span>DOOMSDAY ARK</span></div><div class="chips"><span id="dataChip" class="chip">連線中…</span><span id="phaseChip" class="chip"></span><span id="fpsChip" class="chip dim"></span></div>
      <div class="tools"><select id="qsel" title="畫質"><option value="auto">畫質：自動</option><option value="high">畫質：高</option><option value="mid">畫質：中</option><option value="low">畫質：低</option></select><button id="helpBtn" title="操作說明 (H)">❓</button></div></div>`),this.right=_m(`<div id="right"><button id="camBtn" title="切換視角 (V)">🎥 追隨</button><div id="decks"></div><button id="exBtn" title="展開甲板">🗂 展開</button><button id="listBtn" title="成員 (L)">👥 成員</button></div>`),this.crewPanel=_m(`<div id="crew" class="hide"><div class="hd">👥 船員 <small>點選即可聚焦</small><button class="x">✕</button></div><div class="bd"></div></div>`),this.timebar=_m(`<div id="timebar"><div class="row1"><button data-t="0.27" title="日出">🌅</button><button data-t="0.5" title="正午">☀️</button><button data-t="0.745" title="日落">🌇</button><button data-t="0.96" title="星空">🌌</button>
      <span class="sep"></span><button id="pp" title="暫停/繼續 (T)">⏸</button><button data-s="1" class="sp on">1×</button><button data-s="5" class="sp">5×</button><button data-s="20" class="sp">20×</button><span id="clock"></span></div>
      <input id="slider" type="range" min="0" max="1000" step="1"></div>`),this.elev=_m(`<div id="elevPop" class="hide"><div class="t">🛗 電梯・選擇樓層</div><div class="b"></div></div>`),this.help=_m(`<div id="help" class="hide"><div class="card"><h2>末日方舟 · 操作說明</h2>
      <div class="cols"><div><h3>🖥 電腦</h3><p><b>W A S D / 方向鍵</b> 移動（Shift 跑步）</p><p><b>點擊地板</b> 自動尋路（可跨樓層）</p><p><b>左鍵拖曳</b> 轉動鏡頭　<b>滾輪</b> 縮放</p><p><b>右鍵拖曳</b> 平移（自由視角）</p><p><b>V</b> 切換 追隨/自由/全景　<b>T</b> 暫停時間</p><p><b>1–5</b> 顯示/隱藏樓層　<b>L</b> 成員　<b>H</b> 說明</p></div>
      <div><h3>📱 手機</h3><p><b>左下搖桿</b> 移動</p><p><b>點一下地板</b> 走過去</p><p><b>單指拖曳</b> 轉鏡頭　<b>雙指捏合</b> 縮放</p><p>走到樓梯口自動上下樓；走進電梯會跳出樓層選單。</p></div></div>
      <p class="note">船員的上班/休息/下班狀態來自辦公室公開的 sessions.json（唯讀、每約 2.5 分鐘更新）。本遊戲不會對任何 bot 傳送任何東西。</p><button class="ok">開始航行</button></div></div>`),this.toastEl=_m(`<div id="toast"></div>`),t.append(this.top,this.right,this.crewPanel,this.timebar,this.elev,this.help,this.toastEl),this.qsel=this.top.querySelector(`#qsel`),this.camBtn=this.right.querySelector(`#camBtn`),this.dataChip=this.top.querySelector(`#dataChip`),this.phaseChip=this.top.querySelector(`#phaseChip`),this.fpsChip=this.top.querySelector(`#fpsChip`),this.qsel.value=e.qLocked&&new URLSearchParams(location.search).get(`q`)==null?e.qLevel:`auto`,e.qLocked||(this.qsel.value=`auto`),this.qsel.onchange=()=>{let t=this.qsel.value;t===`auto`?(localStorage.removeItem(`ark.quality`),e.qLocked=!1,this.toast(`畫質：自動（依 FPS 調整）`)):(localStorage.setItem(`ark.quality`,t),e.qLocked=!0,e.setQuality(t),this.toast(`畫質：`+t))},this.top.querySelector(`#helpBtn`).onclick=()=>this.toggleHelp(),this.help.querySelector(`.ok`).onclick=()=>{this.toggleHelp(!1),localStorage.setItem(`ark.helped`,`1`)},this.camBtn.onclick=()=>e.controls.cycleMode(),this.right.querySelector(`#exBtn`).onclick=t=>{let n=e.ship.explodeTarget<1;e.ship.setExplode(n?5:0),t.target.classList.toggle(`on`,n)},this.right.querySelector(`#listBtn`).onclick=()=>this.toggleCrew(),this.crewPanel.querySelector(`.x`).onclick=()=>this.toggleCrew(!1),this.timebar.querySelectorAll(`[data-t]`).forEach(t=>t.onclick=()=>e.setTime(+t.dataset.t)),this.timebar.querySelectorAll(`[data-s]`).forEach(t=>t.onclick=()=>{e.speed=+t.dataset.s,this.syncTime()}),this.timebar.querySelector(`#pp`).onclick=()=>e.togglePause(),this.slider=this.timebar.querySelector(`#slider`),this.sliding=!1,this.slider.addEventListener(`pointerdown`,()=>this.sliding=!0),addEventListener(`pointerup`,()=>this.sliding=!1),this.slider.addEventListener(`input`,()=>e.setTime(this.slider.value/1e3));let n=this.right.querySelector(`#decks`);this.deckBtns=[];for(let e=4;e>=0;e--){let t=_m(`<button class="deck" title="${Jf[e]}"><i></i>${qf[e]}</button>`);t.onclick=()=>this.toggleDeck(e),t.ondblclick=()=>this.gotoDeck(e),n.appendChild(t),this.deckBtns[e]=t}this.syncTime();let r=this.elev.querySelector(`.b`);for(let t=4;t>=0;t--){let n=_m(`<button data-d="${t}">${qf[t]}<small>${Jf[t]}</small></button>`);n.onclick=()=>{e.player.useElevator(t),this.showElevator(null)},r.appendChild(n)}localStorage.getItem(`ark.helped`)||setTimeout(()=>this.toggleHelp(!0),1200)}toast(e){this.toastEl.textContent=e,this.toastEl.classList.add(`show`),clearTimeout(this._tt),this._tt=setTimeout(()=>this.toastEl.classList.remove(`show`),2400)}toggleHelp(e){this.help.classList.toggle(`hide`,e===void 0?!this.help.classList.contains(`hide`):!e)}toggleCrew(e){this.crewPanel.classList.toggle(`hide`,e===void 0?!this.crewPanel.classList.contains(`hide`):!e),this.renderList()}toggleDeck(e){let t=this.game,n=!t.deckVis||t.deckVis[e];t.deckPref[e]=t.deckPref[e]==null?!n:null,this.refreshDeckBtns()}gotoDeck(e){let t=this.game;t.controls.mode!==`follow`&&t.controls.setMode(`follow`),t.player.goTo(e,12,0,{elevator:!0})}refreshDeckBtns(){let e=this.game;this.deckBtns.forEach((t,n)=>{let r=e.deckPref[n];t.classList.toggle(`pinned`,r!=null),t.classList.toggle(`off`,e.deckVis&&!e.deckVis[n]),t.classList.toggle(`here`,e.player.deck===n)})}showElevator(e){e==null?this.elev.classList.add(`hide`):(this.elev.classList.remove(`hide`),this.elev.querySelectorAll(`button`).forEach(t=>t.disabled=+t.dataset.d===e))}syncTime(){let e=this.game;this.timebar.querySelector(`#pp`).textContent=e.paused?`▶`:`⏸`,this.timebar.querySelectorAll(`.sp`).forEach(t=>t.classList.toggle(`on`,+t.dataset.s===e.speed))}renderList(e){if(this.crewPanel.classList.contains(`hide`))return;let t=this.game,n=this.crewPanel.querySelector(`.bd`),r=[...t.crew.bots.values()];if(!e||this._listN!==r.length){n.innerHTML=``,this.rows=new Map,this._listN=r.length;for(let e of r){let r=_m(`<div class="row"><span class="mi"></span><div class="nm"><b></b><small></small></div><div class="stt"></div></div>`);r.onclick=()=>{t.controls.focusOn(e),innerWidth<700&&this.toggleCrew(!1)},n.appendChild(r),this.rows.set(e,r)}}for(let e of r){let t=this.rows.get(e);if(!t)continue;let n=hm[e.info.cat],r=Ip[e.mood]||Ip.focus;t.querySelector(`.mi`).textContent=r.icon,t.querySelector(`b`).textContent=e.title;let i=e.info.cat===`work`?e.activity===`休息一下`?`小歇一下`:`敲鍵盤中`:e.info.cat===`rest`?mm[e.activity]||e.activity||`放鬆`:e.activity||`休息`;i=i+` · `+r.name,e.info.equity!=null&&(i+=` · ${e.info.equity.toFixed(1)}U ${e.info.pnl>=0?`+`:``}${e.info.pnl.toFixed(1)}%`),t.querySelector(`small`).textContent=i;let a=t.querySelector(`.stt`);a.textContent=n[0],a.style.color=n[1],a.style.borderColor=n[1]}}update(){let e=this.game;if(e.envState,this.sliding||(this.slider.value=Math.round(e.dayT*1e3)),this.timebar.querySelector(`#clock`).textContent=Zu(e.dayT)+` `+gm[e.phaseKey],this.phaseChip.textContent=gm[e.phaseKey]||``,this._fc=(this._fc||0)+1,this._fc%20==0){let t=e.dataInfo;t&&(this.dataChip.textContent=t.offline?`🟠 離線示範資料`:`🟢 即時連線 · `+e.crew.bots.size+` 位船員`,this.dataChip.className=`chip `+(t.offline?`warn`:`ok`)),this.fpsChip.textContent=Math.round(e.fps)+` fps · `+e.qLevel,this.refreshDeckBtns()}this.updateLabels()}makeLabel(e,t){let n=_m(`<div class="lb${t?` me`:``}"><div class="sp"></div><div class="st"></div><div class="nm"><span class="mi"></span><span class="n"></span></div></div>`);return n.querySelector(`.n`).textContent=e.title,t&&(n.querySelector(`.mi`).textContent=`👑`),this.labelRoot.appendChild(n),n.onclick=()=>{t||this.game.controls.focusOn(e)},{el:n,sp:n.querySelector(`.sp`),st:n.querySelector(`.st`),mi:n.querySelector(`.mi`),last:{}}}updateLabels(){let e=this.game,t=e.camera,n=e.W,r=e.H,i=this._v||(this._v=new V),a=[...e.crew.bots.values(),e.player];for(let o of a){let a=this.labels.get(o),s=o===e.player;a||(a=this.makeLabel(o,s),this.labels.set(o,a));let c=o.avatar;if(e.deckVis&&!e.deckVis[o.actor.deck]||e.controls.mode!==`overview`&&o.actor.deck!==e.viewDeck||!c.group.visible||o.inBath){a.on!==!1&&(a.el.style.display=`none`,a.on=!1);continue}c.group.getWorldPosition(i),i.y+=o.sleeping?1.3:2.15*(s?1.08:1);let l=t.position.distanceTo(i);if(i.project(t),i.z>1||Math.abs(i.x)>1.1||Math.abs(i.y)>1.1||l>260){a.on!==!1&&(a.el.style.display=`none`,a.on=!1);continue}a.on!==!0&&(a.el.style.display=``,a.on=!0),a.el.style.transform=`translate(${((i.x*.5+.5)*n).toFixed(1)}px,${((-i.y*.5+.5)*r).toFixed(1)}px) translate(-50%,-100%)`;let u=l>70,d=l>36;if(a.el.classList.toggle(`far`,u),a.el.classList.toggle(`mid`,d&&!u),a.el.style.zIndex=1e3-Math.round(l),s)continue;let f=Ip[o.mood]||Ip.focus,p=o.sleeping?`💤`:f.icon;a.last.mi!==p&&(a.mi.textContent=p,a.last.mi=p);let m=o.speech&&o.speech.until>e.time?o.speech:null,h=m?m.text:``;a.last.sp!==h&&(a.sp.textContent=h,a.last.sp=h,a.sp.className=`sp`+(m?` on `+m.kind:``));let g=``;if(o.info.equity!=null){let e=o.info.pnl;g=`${o.info.equity.toFixed(1)}U <i class="${e>=0?`up`:`dn`}">${e>=0?`+`:``}${e.toFixed(1)}%</i>${o.info.pos==null?``:` · `+o.info.pos+`倉`}`}a.last.st!==g&&(a.st.innerHTML=g,a.last.st=g,a.st.style.display=g?``:`none`)}}},ym=document.getElementById(`gl`),bm=new URLSearchParams(location.search),xm;try{xm=new pm(ym)}catch(e){throw document.getElementById(`loading`).innerHTML=`<div class="ld-title">😢</div><div class="ld-sub">你的瀏覽器不支援 WebGL，無法啟動末日方舟</div>`,e}bm.get(`help`)===`0`&&localStorage.setItem(`ark.helped`,`1`),window.ark=xm;var Sm=new vm(xm);xm.ds.start(),bm.get(`t`)&&xm.setTime(+bm.get(`t`)),bm.get(`speed`)&&(xm.speed=+bm.get(`speed`)),bm.get(`pause`)&&(xm.paused=!0);var Cm=xm.controls;if(bm.get(`mode`)&&Cm.setMode(bm.get(`mode`)),bm.get(`cam`)){let e=bm.get(`cam`).split(`,`).map(Number);[Cm.yaw,Cm.pitch,Cm.dist]=e,e.length>=6&&(Cm.target.set(e[3],e[4],e[5]),Cm.mode===`overview`&&Cm.tgtOver.set(e[3],e[4],e[5]))}if(bm.get(`explode`)&&xm.ship.setExplode(+bm.get(`explode`)),bm.get(`deck`)!=null&&bm.get(`deck`)!==``){let e=+bm.get(`deck`);xm.player.actor.place(e,12,6,0)}var wm=performance.now();function Tm(e){let t=Math.min(.1,(e-wm)/1e3);wm=e,xm.frozen||xm.step(t),xm.render(),Sm.update(),requestAnimationFrame(Tm)}requestAnimationFrame(e=>{wm=e,Tm(e),setTimeout(()=>document.getElementById(`loading`).classList.add(`done`),300)});