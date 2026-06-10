var e={};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const t=function(e){const t=[];let n=0;for(let r=0;r<e.length;r++){let i=e.charCodeAt(r);i<128?t[n++]=i:i<2048?(t[n++]=i>>6|192,t[n++]=63&i|128):55296==(64512&i)&&r+1<e.length&&56320==(64512&e.charCodeAt(r+1))?(i=65536+((1023&i)<<10)+(1023&e.charCodeAt(++r)),t[n++]=i>>18|240,t[n++]=i>>12&63|128,t[n++]=i>>6&63|128,t[n++]=63&i|128):(t[n++]=i>>12|224,t[n++]=i>>6&63|128,t[n++]=63&i|128)}return t},n={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<e.length;i+=3){const t=e[i],s=i+1<e.length,o=s?e[i+1]:0,a=i+2<e.length,c=a?e[i+2]:0,u=t>>2,l=(3&t)<<4|o>>4;let h=(15&o)<<2|c>>6,d=63&c;a||(d=64,s||(h=64)),r.push(n[u],n[l],n[h],n[d])}return r.join("")},encodeString(e,n){return this.HAS_NATIVE_SUPPORT&&!n?btoa(e):this.encodeByteArray(t(e),n)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):function(e){const t=[];let n=0,r=0;for(;n<e.length;){const i=e[n++];if(i<128)t[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=e[n++];t[r++]=String.fromCharCode((31&i)<<6|63&s)}else if(i>239&&i<365){const s=((7&i)<<18|(63&e[n++])<<12|(63&e[n++])<<6|63&e[n++])-65536;t[r++]=String.fromCharCode(55296+(s>>10)),t[r++]=String.fromCharCode(56320+(1023&s))}else{const s=e[n++],o=e[n++];t[r++]=String.fromCharCode((15&i)<<12|(63&s)<<6|63&o)}}return t.join("")}(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const n=t?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let s=0;s<e.length;){const t=n[e.charAt(s++)],o=s<e.length?n[e.charAt(s)]:0;++s;const a=s<e.length?n[e.charAt(s)]:64;++s;const c=s<e.length?n[e.charAt(s)]:64;if(++s,null==t||null==o||null==a||null==c)throw new r;const u=t<<2|o>>4;if(i.push(u),64!==a){const e=o<<4&240|a>>2;if(i.push(e),64!==c){const e=a<<6&192|c;i.push(e)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};class r extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const i=function(e){return function(e){const r=t(e);return n.encodeByteArray(r,!0)}(e).replace(/\./g,"")},s=function(e){try{return n.decodeString(e,!0)}catch(t){}return null};
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function o(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw new Error("Unable to locate global object.")}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const a=()=>{try{return o().__FIREBASE_DEFAULTS__||(()=>{if("undefined"==typeof process)return;const t=e.__FIREBASE_DEFAULTS__;return t?JSON.parse(t):void 0})()||(()=>{if("undefined"==typeof document)return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(n){return}const t=e&&s(e[1]);return t&&JSON.parse(t)})()}catch(t){return}},c=e=>{var t,n;return null===(n=null===(t=a())||void 0===t?void 0:t.emulatorHosts)||void 0===n?void 0:n[e]},u=e=>{const t=c(e);if(!t)return;const n=t.lastIndexOf(":");if(n<=0||n+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const r=parseInt(t.substring(n+1),10);return"["===t[0]?[t.substring(1,n-1),r]:[t.substring(0,n),r]},l=()=>{var e;return null===(e=a())||void 0===e?void 0:e.config},h=e=>{var t;return null===(t=a())||void 0===t?void 0:t[`_${e}`]};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class d{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),"function"==typeof e&&(this.promise.catch(()=>{}),1===e.length?e(t):e(t,n))}}}
/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function f(e){try{return(e.startsWith("http://")||e.startsWith("https://")?new URL(e).hostname:e).endsWith(".cloudworkstations.dev")}catch(t){return!1}}async function p(e){return(await fetch(e,{credentials:"include"})).ok}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function m(e,t){if(e.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n=t||"demo-project",r=e.iat||0,s=e.sub||e.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${n}`,aud:n,iat:r,exp:r+3600,auth_time:r,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},e);return[i(JSON.stringify({alg:"none",type:"JWT"})),i(JSON.stringify(o)),""].join(".")}const g={};let y=!1;function v(e,t){if("undefined"==typeof window||"undefined"==typeof document||!f(window.location.host)||g[e]===t||g[e]||y)return;function n(e){return`__firebase__banner__${e}`}g[e]=t;const r="__firebase__banner",i=function(){const e={prod:[],emulator:[]};for(const t of Object.keys(g))g[t]?e.emulator.push(t):e.prod.push(t);return e}().prod.length>0;function s(){const e=document.createElement("span");return e.style.cursor="pointer",e.style.marginLeft="16px",e.style.fontSize="24px",e.innerHTML=" &times;",e.onclick=()=>{y=!0,function(){const e=document.getElementById(r);e&&e.remove()}()},e}function o(){const e=function(e){let t=document.getElementById(e),n=!1;return t||(t=document.createElement("div"),t.setAttribute("id",e),n=!0),{created:n,element:t}}(r),t=n("text"),o=document.getElementById(t)||document.createElement("span"),a=n("learnmore"),c=document.getElementById(a)||document.createElement("a"),u=n("preprendIcon"),l=document.getElementById(u)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(e.created){const t=e.element;!function(e){e.style.display="flex",e.style.background="#7faaf0",e.style.position="fixed",e.style.bottom="5px",e.style.left="5px",e.style.padding=".5em",e.style.borderRadius="5px",e.style.alignItems="center"}(t),function(e,t){e.setAttribute("id",t),e.innerText="Learn more",e.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",e.setAttribute("target","__blank"),e.style.paddingLeft="5px",e.style.textDecoration="underline"}(c,a);const n=s();!function(e,t){e.setAttribute("width","24"),e.setAttribute("id",t),e.setAttribute("height","24"),e.setAttribute("viewBox","0 0 24 24"),e.setAttribute("fill","none"),e.style.marginLeft="-6px"}(l,u),t.append(l,o,c,n),document.body.appendChild(t)}i?(o.innerText="Preview backend disconnected.",l.innerHTML='<g clip-path="url(#clip0_6013_33858)">\n<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>\n</g>\n<defs>\n<clipPath id="clip0_6013_33858">\n<rect width="24" height="24" fill="white"/>\n</clipPath>\n</defs>'):(l.innerHTML='<g clip-path="url(#clip0_6083_34804)">\n<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>\n</g>\n<defs>\n<clipPath id="clip0_6083_34804">\n<rect width="24" height="24" fill="white"/>\n</clipPath>\n</defs>',o.innerText="Preview backend running in this workspace."),o.setAttribute("id",t)}"loading"===document.readyState?window.addEventListener("DOMContentLoaded",o):o()}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function w(){return"undefined"!=typeof navigator&&"string"==typeof navigator.userAgent?navigator.userAgent:""}function b(){var e;const t=null===(e=a())||void 0===e?void 0:e.forceEnvironment;if("node"===t)return!0;if("browser"===t)return!1;try{return"[object process]"===Object.prototype.toString.call(global.process)}catch(n){return!1}}function I(){const e="object"==typeof chrome?chrome.runtime:"object"==typeof browser?browser.runtime:void 0;return"object"==typeof e&&void 0!==e.id}function _(){return!b()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function T(){return!b()&&!!navigator.userAgent&&(navigator.userAgent.includes("Safari")||navigator.userAgent.includes("WebKit"))&&!navigator.userAgent.includes("Chrome")}function E(){try{return"object"==typeof indexedDB}catch(e){return!1}}function S(){return new Promise((e,t)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),e(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var e;t((null===(e=i.error)||void 0===e?void 0:e.message)||"")}}catch(n){t(n)}})}function C(){return!("undefined"==typeof navigator||!navigator.cookieEnabled)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class A extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name="FirebaseError",Object.setPrototypeOf(this,A.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,k.prototype.create)}}class k{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},r=`${this.service}/${e}`,i=this.errors[e],s=i?function(e,t){return e.replace(N,(e,n)=>{const r=t[n];return null!=r?String(r):`<${n}?>`})}(i,n):"Error",o=`${this.serviceName}: ${s} (${r}).`;return new A(r,o,n)}}const N=/\{\$([^}]+)}/g;function D(e,t){if(e===t)return!0;const n=Object.keys(e),r=Object.keys(t);for(const i of n){if(!r.includes(i))return!1;const n=e[i],s=t[i];if(x(n)&&x(s)){if(!D(n,s))return!1}else if(n!==s)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function x(e){return null!==e&&"object"==typeof e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function R(e){const t=[];for(const[n,r]of Object.entries(e))Array.isArray(r)?r.forEach(e=>{t.push(encodeURIComponent(n)+"="+encodeURIComponent(e))}):t.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return t.length?"&"+t.join("&"):""}function O(e){const t={};return e.replace(/^\?/,"").split("&").forEach(e=>{if(e){const[n,r]=e.split("=");t[decodeURIComponent(n)]=decodeURIComponent(r)}}),t}function P(e){const t=e.indexOf("?");if(!t)return"";const n=e.indexOf("#",t);return e.substring(t,n>0?n:void 0)}class L{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(e=>{this.error(e)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let r;if(void 0===e&&void 0===t&&void 0===n)throw new Error("Missing Observer.");r=function(e,t){if("object"!=typeof e||null===e)return!1;for(const n of t)if(n in e&&"function"==typeof e[n])return!0;return!1}(e,["next","error","complete"])?e:{next:e,error:t,complete:n},void 0===r.next&&(r.next=M),void 0===r.error&&(r.error=M),void 0===r.complete&&(r.complete=M);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch(e){}}),this.observers.push(r),i}unsubscribeOne(e){void 0!==this.observers&&void 0!==this.observers[e]&&(delete this.observers[e],this.observerCount-=1,0===this.observerCount&&void 0!==this.onNoObservers&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(void 0!==this.observers&&void 0!==this.observers[e])try{t(this.observers[e])}catch(n){"undefined"!=typeof console&&console.error}})}close(e){this.finalized||(this.finalized=!0,void 0!==e&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function M(){}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function F(e,t=1e3,n=2){const r=t*Math.pow(n,e),i=Math.round(.5*r*(Math.random()-.5)*2);return Math.min(144e5,r+i)}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function V(e){return e&&e._delegate?e._delegate:e}class U{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const j="[DEFAULT]";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const e=new d;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{const n=this.getOrInitializeService({instanceIdentifier:t});n&&e.resolve(n)}catch(n){}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const n=this.normalizeInstanceIdentifier(null==e?void 0:e.identifier),r=null!==(t=null==e?void 0:e.optional)&&void 0!==t&&t;if(!this.isInitialized(n)&&!this.shouldAutoInitialize()){if(r)return null;throw Error(`Service ${this.name} is not available`)}try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if(function(e){return"EAGER"===e.instantiationMode}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e))try{this.getOrInitializeService({instanceIdentifier:j})}catch(t){}for(const[e,n]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(e);try{const e=this.getOrInitializeService({instanceIdentifier:r});n.resolve(e)}catch(t){}}}}clearInstance(e=j){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...e.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return null!=this.component}isInitialized(e=j){return this.instances.has(e)}getOptions(e=j){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[i,s]of this.instancesDeferred.entries()){n===this.normalizeInstanceIdentifier(i)&&s.resolve(r)}return r}onInit(e,t){var n;const r=this.normalizeInstanceIdentifier(t),i=null!==(n=this.onInitCallbacks.get(r))&&void 0!==n?n:new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const i of n)try{i(e,t)}catch(r){}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:(r=e,r===j?void 0:r),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch(i){}var r;return n||null}normalizeInstanceIdentifier(e=j){return this.component?this.component.multipleInstances?e:j:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}}class q{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new B(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var z,$;($=z||(z={}))[$.DEBUG=0]="DEBUG",$[$.VERBOSE=1]="VERBOSE",$[$.INFO=2]="INFO",$[$.WARN=3]="WARN",$[$.ERROR=4]="ERROR",$[$.SILENT=5]="SILENT";const K={debug:z.DEBUG,verbose:z.VERBOSE,info:z.INFO,warn:z.WARN,error:z.ERROR,silent:z.SILENT},G=z.INFO,H={[z.DEBUG]:"log",[z.VERBOSE]:"log",[z.INFO]:"info",[z.WARN]:"warn",[z.ERROR]:"error"},W=(e,t,...n)=>{if(t<e.logLevel)return;(new Date).toISOString();if(!H[t])throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class Q{constructor(e){this.name=e,this._logLevel=G,this._logHandler=W,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in z))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel="string"==typeof e?K[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!=typeof e)throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,z.DEBUG,...e),this._logHandler(this,z.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,z.VERBOSE,...e),this._logHandler(this,z.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,z.INFO,...e),this._logHandler(this,z.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,z.WARN,...e),this._logHandler(this,z.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,z.ERROR,...e),this._logHandler(this,z.ERROR,...e)}}let J,X;const Y=new WeakMap,Z=new WeakMap,ee=new WeakMap,te=new WeakMap,ne=new WeakMap;let re={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return Z.get(e);if("objectStoreNames"===t)return e.objectStoreNames||ee.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return oe(e[t])},set:(e,t,n)=>(e[t]=n,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function ie(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(X||(X=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(ae(this),t),oe(Y.get(this))}:function(...t){return oe(e.apply(ae(this),t))}:function(t,...n){const r=e.call(ae(this),t,...n);return ee.set(r,t.sort?t.sort():[t]),oe(r)}}function se(e){return"function"==typeof e?ie(e):(e instanceof IDBTransaction&&function(e){if(Z.has(e))return;const t=new Promise((t,n)=>{const r=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",s),e.removeEventListener("abort",s)},i=()=>{t(),r()},s=()=>{n(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",i),e.addEventListener("error",s),e.addEventListener("abort",s)});Z.set(e,t)}(e),t=e,(J||(J=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])).some(e=>t instanceof e)?new Proxy(e,re):e);var t}function oe(e){if(e instanceof IDBRequest)return function(e){const t=new Promise((t,n)=>{const r=()=>{e.removeEventListener("success",i),e.removeEventListener("error",s)},i=()=>{t(oe(e.result)),r()},s=()=>{n(e.error),r()};e.addEventListener("success",i),e.addEventListener("error",s)});return t.then(t=>{t instanceof IDBCursor&&Y.set(t,e)}).catch(()=>{}),ne.set(t,e),t}(e);if(te.has(e))return te.get(e);const t=se(e);return t!==e&&(te.set(e,t),ne.set(t,e)),t}const ae=e=>ne.get(e);function ce(e,t,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const o=indexedDB.open(e,t),a=oe(o);return r&&o.addEventListener("upgradeneeded",e=>{r(oe(o.result),e.oldVersion,e.newVersion,oe(o.transaction),e)}),n&&o.addEventListener("blocked",e=>n(e.oldVersion,e.newVersion,e)),a.then(e=>{s&&e.addEventListener("close",()=>s()),i&&e.addEventListener("versionchange",e=>i(e.oldVersion,e.newVersion,e))}).catch(()=>{}),a}const ue=["get","getKey","getAll","getAllKeys","count"],le=["put","add","delete","clear"],he=new Map;function de(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(he.get(t))return he.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,i=le.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!i&&!ue.includes(n))return;const s=async function(e,...t){const s=this.transaction(e,i?"readwrite":"readonly");let o=s.store;return r&&(o=o.index(t.shift())),(await Promise.all([o[n](...t),i&&s.done]))[0]};return he.set(t,s),s}re=(e=>({...e,get:(t,n,r)=>de(t,n)||e.get(t,n,r),has:(t,n)=>!!de(t,n)||e.has(t,n)}))(re);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class fe{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(function(e){const t=e.getComponent();return"VERSION"===(null==t?void 0:t.type)}(e)){const t=e.getImmediate();return`${t.library}/${t.version}`}return null}).filter(e=>e).join(" ")}}const pe="@firebase/app",me="0.13.2",ge=new Q("@firebase/app"),ye="@firebase/app-compat",ve="@firebase/analytics-compat",we="@firebase/analytics",be="@firebase/app-check-compat",Ie="@firebase/app-check",_e="@firebase/auth",Te="@firebase/auth-compat",Ee="@firebase/database",Se="@firebase/data-connect",Ce="@firebase/database-compat",Ae="@firebase/functions",ke="@firebase/functions-compat",Ne="@firebase/installations",De="@firebase/installations-compat",xe="@firebase/messaging",Re="@firebase/messaging-compat",Oe="@firebase/performance",Pe="@firebase/performance-compat",Le="@firebase/remote-config",Me="@firebase/remote-config-compat",Fe="@firebase/storage",Ve="@firebase/storage-compat",Ue="@firebase/firestore",je="@firebase/ai",Be="@firebase/firestore-compat",qe="firebase",ze="[DEFAULT]",$e={[pe]:"fire-core",[ye]:"fire-core-compat",[we]:"fire-analytics",[ve]:"fire-analytics-compat",[Ie]:"fire-app-check",[be]:"fire-app-check-compat",[_e]:"fire-auth",[Te]:"fire-auth-compat",[Ee]:"fire-rtdb",[Se]:"fire-data-connect",[Ce]:"fire-rtdb-compat",[Ae]:"fire-fn",[ke]:"fire-fn-compat",[Ne]:"fire-iid",[De]:"fire-iid-compat",[xe]:"fire-fcm",[Re]:"fire-fcm-compat",[Oe]:"fire-perf",[Pe]:"fire-perf-compat",[Le]:"fire-rc",[Me]:"fire-rc-compat",[Fe]:"fire-gcs",[Ve]:"fire-gcs-compat",[Ue]:"fire-fst",[Be]:"fire-fst-compat",[je]:"fire-vertex","fire-js":"fire-js",[qe]:"fire-js-all"},Ke=new Map,Ge=new Map,He=new Map;function We(e,t){try{e.container.addComponent(t)}catch(n){ge.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function Qe(e){const t=e.name;if(He.has(t))return ge.debug(`There were multiple attempts to register component ${t}.`),!1;He.set(t,e);for(const n of Ke.values())We(n,e);for(const n of Ge.values())We(n,e);return!0}function Je(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}function Xe(e){return null!=e&&void 0!==e.settings}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ye=new k("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."});
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ze{constructor(e,t,n){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new U("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ye.create("app-deleted",{appName:this._name})}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const et="11.10.0";function tt(e,t={}){let n=e;if("object"!=typeof t){t={name:t}}const r=Object.assign({name:ze,automaticDataCollectionEnabled:!0},t),i=r.name;if("string"!=typeof i||!i)throw Ye.create("bad-app-name",{appName:String(i)});if(n||(n=l()),!n)throw Ye.create("no-options");const s=Ke.get(i);if(s){if(D(n,s.options)&&D(r,s.config))return s;throw Ye.create("duplicate-app",{appName:i})}const o=new q(i);for(const c of He.values())o.addComponent(c);const a=new Ze(n,r,o);return Ke.set(i,a),a}function nt(e=ze){const t=Ke.get(e);if(!t&&e===ze&&l())return tt();if(!t)throw Ye.create("no-app",{appName:e});return t}function rt(e,t,n){var r;let i=null!==(r=$e[e])&&void 0!==r?r:e;n&&(i+=`-${n}`);const s=i.match(/\s|\//),o=t.match(/\s|\//);if(s||o){const e=[`Unable to register library "${i}" with version "${t}":`];return s&&e.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&o&&e.push("and"),o&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),void ge.warn(e.join(" "))}Qe(new U(`${i}-version`,()=>({library:i,version:t}),"VERSION"))}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const it="firebase-heartbeat-store";let st=null;function ot(){return st||(st=ce("firebase-heartbeat-database",1,{upgrade:(e,t)=>{if(0===t)try{e.createObjectStore(it)}catch(n){}}}).catch(e=>{throw Ye.create("idb-open",{originalErrorMessage:e.message})})),st}async function at(e,t){try{const n=(await ot()).transaction(it,"readwrite"),r=n.objectStore(it);await r.put(t,ct(e)),await n.done}catch(n){if(n instanceof A)ge.warn(n.message);else{const e=Ye.create("idb-set",{originalErrorMessage:null==n?void 0:n.message});ge.warn(e.message)}}}function ct(e){return`${e.name}!${e.options.appId}`}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ut{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new ht(t),this._heartbeatsCachePromise=this._storage.read().then(e=>(this._heartbeatsCache=e,e))}async triggerHeartbeat(){var e,t;try{const n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=lt();if(null==(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)&&(this._heartbeatsCache=await this._heartbeatsCachePromise,null==(null===(t=this._heartbeatsCache)||void 0===t?void 0:t.heartbeats)))return;if(this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(e=>e.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:n}),this._heartbeatsCache.heartbeats.length>30){const e=function(e){if(0===e.length)return-1;let t=0,n=e[0].date;for(let r=1;r<e.length;r++)e[r].date<n&&(n=e[r].date,t=r);return t}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(e,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){ge.warn(n)}}async getHeartbeatsHeader(){var e;try{if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,null==(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)||0===this._heartbeatsCache.heartbeats.length)return"";const t=lt(),{heartbeatsToSend:n,unsentEntries:r}=function(e,t=1024){const n=[];let r=e.slice();for(const i of e){const e=n.find(e=>e.agent===i.agent);if(e){if(e.dates.push(i.date),dt(n)>t){e.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),dt(n)>t){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}(this._heartbeatsCache.heartbeats),s=i(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return ge.warn(t),""}}}function lt(){return(new Date).toISOString().substring(0,10)}class ht{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!E()&&S().then(()=>!0).catch(()=>!1)}async read(){if(await this._canUseIndexedDBPromise){const e=await async function(e){try{const t=(await ot()).transaction(it),n=await t.objectStore(it).get(ct(e));return await t.done,n}catch(t){if(t instanceof A)ge.warn(t.message);else{const e=Ye.create("idb-get",{originalErrorMessage:null==t?void 0:t.message});ge.warn(e.message)}}}(this.app);return(null==e?void 0:e.heartbeats)?e:{heartbeats:[]}}return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const n=await this.read();return at(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:n.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){var t;if(await this._canUseIndexedDBPromise){const n=await this.read();return at(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...e.heartbeats]})}}}function dt(e){return i(JSON.stringify({version:2,heartbeats:e})).length}var ft;ft="",Qe(new U("platform-logger",e=>new fe(e),"PRIVATE")),Qe(new U("heartbeat",e=>new ut(e),"PRIVATE")),rt(pe,me,ft),rt(pe,me,"esm2017"),rt("fire-js","");
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
rt("firebase","11.10.0","app");var pt,mt,gt="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/(function(){var e;
/** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */function t(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}function n(e,t,n){n||(n=0);var r=Array(16);if("string"==typeof t)for(var i=0;16>i;++i)r[i]=t.charCodeAt(n++)|t.charCodeAt(n++)<<8|t.charCodeAt(n++)<<16|t.charCodeAt(n++)<<24;else for(i=0;16>i;++i)r[i]=t[n++]|t[n++]<<8|t[n++]<<16|t[n++]<<24;t=e.g[0],n=e.g[1],i=e.g[2];var s=e.g[3],o=t+(s^n&(i^s))+r[0]+3614090360&4294967295;o=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=(n=(i=(s=(t=n+(o<<7&4294967295|o>>>25))+((o=s+(i^t&(n^i))+r[1]+3905402710&4294967295)<<12&4294967295|o>>>20))+((o=i+(n^s&(t^n))+r[2]+606105819&4294967295)<<17&4294967295|o>>>15))+((o=n+(t^i&(s^t))+r[3]+3250441966&4294967295)<<22&4294967295|o>>>10))+((o=t+(s^n&(i^s))+r[4]+4118548399&4294967295)<<7&4294967295|o>>>25))+((o=s+(i^t&(n^i))+r[5]+1200080426&4294967295)<<12&4294967295|o>>>20))+((o=i+(n^s&(t^n))+r[6]+2821735955&4294967295)<<17&4294967295|o>>>15))+((o=n+(t^i&(s^t))+r[7]+4249261313&4294967295)<<22&4294967295|o>>>10))+((o=t+(s^n&(i^s))+r[8]+1770035416&4294967295)<<7&4294967295|o>>>25))+((o=s+(i^t&(n^i))+r[9]+2336552879&4294967295)<<12&4294967295|o>>>20))+((o=i+(n^s&(t^n))+r[10]+4294925233&4294967295)<<17&4294967295|o>>>15))+((o=n+(t^i&(s^t))+r[11]+2304563134&4294967295)<<22&4294967295|o>>>10))+((o=t+(s^n&(i^s))+r[12]+1804603682&4294967295)<<7&4294967295|o>>>25))+((o=s+(i^t&(n^i))+r[13]+4254626195&4294967295)<<12&4294967295|o>>>20))+((o=i+(n^s&(t^n))+r[14]+2792965006&4294967295)<<17&4294967295|o>>>15))+((o=n+(t^i&(s^t))+r[15]+1236535329&4294967295)<<22&4294967295|o>>>10))+((o=t+(i^s&(n^i))+r[1]+4129170786&4294967295)<<5&4294967295|o>>>27))+((o=s+(n^i&(t^n))+r[6]+3225465664&4294967295)<<9&4294967295|o>>>23))+((o=i+(t^n&(s^t))+r[11]+643717713&4294967295)<<14&4294967295|o>>>18))+((o=n+(s^t&(i^s))+r[0]+3921069994&4294967295)<<20&4294967295|o>>>12))+((o=t+(i^s&(n^i))+r[5]+3593408605&4294967295)<<5&4294967295|o>>>27))+((o=s+(n^i&(t^n))+r[10]+38016083&4294967295)<<9&4294967295|o>>>23))+((o=i+(t^n&(s^t))+r[15]+3634488961&4294967295)<<14&4294967295|o>>>18))+((o=n+(s^t&(i^s))+r[4]+3889429448&4294967295)<<20&4294967295|o>>>12))+((o=t+(i^s&(n^i))+r[9]+568446438&4294967295)<<5&4294967295|o>>>27))+((o=s+(n^i&(t^n))+r[14]+3275163606&4294967295)<<9&4294967295|o>>>23))+((o=i+(t^n&(s^t))+r[3]+4107603335&4294967295)<<14&4294967295|o>>>18))+((o=n+(s^t&(i^s))+r[8]+1163531501&4294967295)<<20&4294967295|o>>>12))+((o=t+(i^s&(n^i))+r[13]+2850285829&4294967295)<<5&4294967295|o>>>27))+((o=s+(n^i&(t^n))+r[2]+4243563512&4294967295)<<9&4294967295|o>>>23))+((o=i+(t^n&(s^t))+r[7]+1735328473&4294967295)<<14&4294967295|o>>>18))+((o=n+(s^t&(i^s))+r[12]+2368359562&4294967295)<<20&4294967295|o>>>12))+((o=t+(n^i^s)+r[5]+4294588738&4294967295)<<4&4294967295|o>>>28))+((o=s+(t^n^i)+r[8]+2272392833&4294967295)<<11&4294967295|o>>>21))+((o=i+(s^t^n)+r[11]+1839030562&4294967295)<<16&4294967295|o>>>16))+((o=n+(i^s^t)+r[14]+4259657740&4294967295)<<23&4294967295|o>>>9))+((o=t+(n^i^s)+r[1]+2763975236&4294967295)<<4&4294967295|o>>>28))+((o=s+(t^n^i)+r[4]+1272893353&4294967295)<<11&4294967295|o>>>21))+((o=i+(s^t^n)+r[7]+4139469664&4294967295)<<16&4294967295|o>>>16))+((o=n+(i^s^t)+r[10]+3200236656&4294967295)<<23&4294967295|o>>>9))+((o=t+(n^i^s)+r[13]+681279174&4294967295)<<4&4294967295|o>>>28))+((o=s+(t^n^i)+r[0]+3936430074&4294967295)<<11&4294967295|o>>>21))+((o=i+(s^t^n)+r[3]+3572445317&4294967295)<<16&4294967295|o>>>16))+((o=n+(i^s^t)+r[6]+76029189&4294967295)<<23&4294967295|o>>>9))+((o=t+(n^i^s)+r[9]+3654602809&4294967295)<<4&4294967295|o>>>28))+((o=s+(t^n^i)+r[12]+3873151461&4294967295)<<11&4294967295|o>>>21))+((o=i+(s^t^n)+r[15]+530742520&4294967295)<<16&4294967295|o>>>16))+((o=n+(i^s^t)+r[2]+3299628645&4294967295)<<23&4294967295|o>>>9))+((o=t+(i^(n|~s))+r[0]+4096336452&4294967295)<<6&4294967295|o>>>26))+((o=s+(n^(t|~i))+r[7]+1126891415&4294967295)<<10&4294967295|o>>>22))+((o=i+(t^(s|~n))+r[14]+2878612391&4294967295)<<15&4294967295|o>>>17))+((o=n+(s^(i|~t))+r[5]+4237533241&4294967295)<<21&4294967295|o>>>11))+((o=t+(i^(n|~s))+r[12]+1700485571&4294967295)<<6&4294967295|o>>>26))+((o=s+(n^(t|~i))+r[3]+2399980690&4294967295)<<10&4294967295|o>>>22))+((o=i+(t^(s|~n))+r[10]+4293915773&4294967295)<<15&4294967295|o>>>17))+((o=n+(s^(i|~t))+r[1]+2240044497&4294967295)<<21&4294967295|o>>>11))+((o=t+(i^(n|~s))+r[8]+1873313359&4294967295)<<6&4294967295|o>>>26))+((o=s+(n^(t|~i))+r[15]+4264355552&4294967295)<<10&4294967295|o>>>22))+((o=i+(t^(s|~n))+r[6]+2734768916&4294967295)<<15&4294967295|o>>>17))+((o=n+(s^(i|~t))+r[13]+1309151649&4294967295)<<21&4294967295|o>>>11))+((s=(t=n+((o=t+(i^(n|~s))+r[4]+4149444226&4294967295)<<6&4294967295|o>>>26))+((o=s+(n^(t|~i))+r[11]+3174756917&4294967295)<<10&4294967295|o>>>22))^((i=s+((o=i+(t^(s|~n))+r[2]+718787259&4294967295)<<15&4294967295|o>>>17))|~t))+r[9]+3951481745&4294967295,e.g[0]=e.g[0]+t&4294967295,e.g[1]=e.g[1]+(i+(o<<21&4294967295|o>>>11))&4294967295,e.g[2]=e.g[2]+i&4294967295,e.g[3]=e.g[3]+s&4294967295}function r(e,t){this.h=t;for(var n=[],r=!0,i=e.length-1;0<=i;i--){var s=0|e[i];r&&s==t||(n[i]=s,r=!1)}this.g=n}!function(e,t){function n(){}n.prototype=t.prototype,e.D=t.prototype,e.prototype=new n,e.prototype.constructor=e,e.C=function(e,n,r){for(var i=Array(arguments.length-2),s=2;s<arguments.length;s++)i[s-2]=arguments[s];return t.prototype[n].apply(e,i)}}(t,function(){this.blockSize=-1}),t.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0},t.prototype.u=function(e,t){void 0===t&&(t=e.length);for(var r=t-this.blockSize,i=this.B,s=this.h,o=0;o<t;){if(0==s)for(;o<=r;)n(this,e,o),o+=this.blockSize;if("string"==typeof e){for(;o<t;)if(i[s++]=e.charCodeAt(o++),s==this.blockSize){n(this,i),s=0;break}}else for(;o<t;)if(i[s++]=e[o++],s==this.blockSize){n(this,i),s=0;break}}this.h=s,this.o+=t},t.prototype.v=function(){var e=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);e[0]=128;for(var t=1;t<e.length-8;++t)e[t]=0;var n=8*this.o;for(t=e.length-8;t<e.length;++t)e[t]=255&n,n/=256;for(this.u(e),e=Array(16),t=n=0;4>t;++t)for(var r=0;32>r;r+=8)e[n++]=this.g[t]>>>r&255;return e};var i={};function s(e){return-128<=e&&128>e?function(e,t){var n=i;return Object.prototype.hasOwnProperty.call(n,e)?n[e]:n[e]=t(e)}(e,function(e){return new r([0|e],0>e?-1:0)}):new r([0|e],0>e?-1:0)}function o(e){if(isNaN(e)||!isFinite(e))return a;if(0>e)return d(o(-e));for(var t=[],n=1,i=0;e>=n;i++)t[i]=e/n|0,n*=4294967296;return new r(t,0)}var a=s(0),c=s(1),u=s(16777216);function l(e){if(0!=e.h)return!1;for(var t=0;t<e.g.length;t++)if(0!=e.g[t])return!1;return!0}function h(e){return-1==e.h}function d(e){for(var t=e.g.length,n=[],i=0;i<t;i++)n[i]=~e.g[i];return new r(n,~e.h).add(c)}function f(e,t){return e.add(d(t))}function p(e,t){for(;(65535&e[t])!=e[t];)e[t+1]+=e[t]>>>16,e[t]&=65535,t++}function m(e,t){this.g=e,this.h=t}function g(e,t){if(l(t))throw Error("division by zero");if(l(e))return new m(a,a);if(h(e))return t=g(d(e),t),new m(d(t.g),d(t.h));if(h(t))return t=g(e,d(t)),new m(d(t.g),t.h);if(30<e.g.length){if(h(e)||h(t))throw Error("slowDivide_ only works with positive integers.");for(var n=c,r=t;0>=r.l(e);)n=y(n),r=y(r);var i=v(n,1),s=v(r,1);for(r=v(r,2),n=v(n,2);!l(r);){var u=s.add(r);0>=u.l(e)&&(i=i.add(n),s=u),r=v(r,1),n=v(n,1)}return t=f(e,i.j(t)),new m(i,t)}for(i=a;0<=e.l(t);){for(n=Math.max(1,Math.floor(e.m()/t.m())),r=48>=(r=Math.ceil(Math.log(n)/Math.LN2))?1:Math.pow(2,r-48),u=(s=o(n)).j(t);h(u)||0<u.l(e);)u=(s=o(n-=r)).j(t);l(s)&&(s=c),i=i.add(s),e=f(e,u)}return new m(i,e)}function y(e){for(var t=e.g.length+1,n=[],i=0;i<t;i++)n[i]=e.i(i)<<1|e.i(i-1)>>>31;return new r(n,e.h)}function v(e,t){var n=t>>5;t%=32;for(var i=e.g.length-n,s=[],o=0;o<i;o++)s[o]=0<t?e.i(o+n)>>>t|e.i(o+n+1)<<32-t:e.i(o+n);return new r(s,e.h)}(e=r.prototype).m=function(){if(h(this))return-d(this).m();for(var e=0,t=1,n=0;n<this.g.length;n++){var r=this.i(n);e+=(0<=r?r:4294967296+r)*t,t*=4294967296}return e},e.toString=function(e){if(2>(e=e||10)||36<e)throw Error("radix out of range: "+e);if(l(this))return"0";if(h(this))return"-"+d(this).toString(e);for(var t=o(Math.pow(e,6)),n=this,r="";;){var i=g(n,t).g,s=((0<(n=f(n,i.j(t))).g.length?n.g[0]:n.h)>>>0).toString(e);if(l(n=i))return s+r;for(;6>s.length;)s="0"+s;r=s+r}},e.i=function(e){return 0>e?0:e<this.g.length?this.g[e]:this.h},e.l=function(e){return h(e=f(this,e))?-1:l(e)?0:1},e.abs=function(){return h(this)?d(this):this},e.add=function(e){for(var t=Math.max(this.g.length,e.g.length),n=[],i=0,s=0;s<=t;s++){var o=i+(65535&this.i(s))+(65535&e.i(s)),a=(o>>>16)+(this.i(s)>>>16)+(e.i(s)>>>16);i=a>>>16,o&=65535,a&=65535,n[s]=a<<16|o}return new r(n,-2147483648&n[n.length-1]?-1:0)},e.j=function(e){if(l(this)||l(e))return a;if(h(this))return h(e)?d(this).j(d(e)):d(d(this).j(e));if(h(e))return d(this.j(d(e)));if(0>this.l(u)&&0>e.l(u))return o(this.m()*e.m());for(var t=this.g.length+e.g.length,n=[],i=0;i<2*t;i++)n[i]=0;for(i=0;i<this.g.length;i++)for(var s=0;s<e.g.length;s++){var c=this.i(i)>>>16,f=65535&this.i(i),m=e.i(s)>>>16,g=65535&e.i(s);n[2*i+2*s]+=f*g,p(n,2*i+2*s),n[2*i+2*s+1]+=c*g,p(n,2*i+2*s+1),n[2*i+2*s+1]+=f*m,p(n,2*i+2*s+1),n[2*i+2*s+2]+=c*m,p(n,2*i+2*s+2)}for(i=0;i<t;i++)n[i]=n[2*i+1]<<16|n[2*i];for(i=t;i<2*t;i++)n[i]=0;return new r(n,0)},e.A=function(e){return g(this,e).h},e.and=function(e){for(var t=Math.max(this.g.length,e.g.length),n=[],i=0;i<t;i++)n[i]=this.i(i)&e.i(i);return new r(n,this.h&e.h)},e.or=function(e){for(var t=Math.max(this.g.length,e.g.length),n=[],i=0;i<t;i++)n[i]=this.i(i)|e.i(i);return new r(n,this.h|e.h)},e.xor=function(e){for(var t=Math.max(this.g.length,e.g.length),n=[],i=0;i<t;i++)n[i]=this.i(i)^e.i(i);return new r(n,this.h^e.h)},t.prototype.digest=t.prototype.v,t.prototype.reset=t.prototype.s,t.prototype.update=t.prototype.u,mt=t,r.prototype.add=r.prototype.add,r.prototype.multiply=r.prototype.j,r.prototype.modulo=r.prototype.A,r.prototype.compare=r.prototype.l,r.prototype.toNumber=r.prototype.m,r.prototype.toString=r.prototype.toString,r.prototype.getBits=r.prototype.i,r.fromNumber=o,r.fromString=function e(t,n){if(0==t.length)throw Error("number format error: empty string");if(2>(n=n||10)||36<n)throw Error("radix out of range: "+n);if("-"==t.charAt(0))return d(e(t.substring(1),n));if(0<=t.indexOf("-"))throw Error('number format error: interior "-" character');for(var r=o(Math.pow(n,8)),i=a,s=0;s<t.length;s+=8){var c=Math.min(8,t.length-s),u=parseInt(t.substring(s,s+c),n);8>c?(c=o(Math.pow(n,c)),i=i.j(c).add(o(u))):i=(i=i.j(r)).add(o(u))}return i},pt=r}).apply(void 0!==gt?gt:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});var yt,vt,wt,bt,It,_t,Tt,Et,St="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/(function(){var e,t="function"==typeof Object.defineProperties?Object.defineProperty:function(e,t,n){return e==Array.prototype||e==Object.prototype||(e[t]=n.value),e};var n=function(e){e=["object"==typeof globalThis&&globalThis,e,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof St&&St];for(var t=0;t<e.length;++t){var n=e[t];if(n&&n.Math==Math)return n}throw Error("Cannot find global object")}(this);!function(e,r){if(r)e:{var i=n;e=e.split(".");for(var s=0;s<e.length-1;s++){var o=e[s];if(!(o in i))break e;i=i[o]}(r=r(s=i[e=e[e.length-1]]))!=s&&null!=r&&t(i,e,{configurable:!0,writable:!0,value:r})}}("Array.prototype.values",function(e){return e||function(){return function(e,t){e instanceof String&&(e+="");var n=0,r=!1,i={next:function(){if(!r&&n<e.length){var i=n++;return{value:t(i,e[i]),done:!1}}return r=!0,{done:!0,value:void 0}}};return i[Symbol.iterator]=function(){return i},i}(this,function(e,t){return t})}});
/** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */
var r=r||{},i=this||self;function s(e){var t=typeof e;return"array"==(t="object"!=t?t:e?Array.isArray(e)?"array":t:"null")||"object"==t&&"number"==typeof e.length}function o(e){var t=typeof e;return"object"==t&&null!=e||"function"==t}function a(e,t,n){return e.call.apply(e.bind,arguments)}function c(e,t,n){if(!e)throw Error();if(2<arguments.length){var r=Array.prototype.slice.call(arguments,2);return function(){var n=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(n,r),e.apply(t,n)}}return function(){return e.apply(t,arguments)}}function u(e,t,n){return(u=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?a:c).apply(null,arguments)}function l(e,t){var n=Array.prototype.slice.call(arguments,1);return function(){var t=n.slice();return t.push.apply(t,arguments),e.apply(this,t)}}function h(e,t){function n(){}n.prototype=t.prototype,e.aa=t.prototype,e.prototype=new n,e.prototype.constructor=e,e.Qb=function(e,n,r){for(var i=Array(arguments.length-2),s=2;s<arguments.length;s++)i[s-2]=arguments[s];return t.prototype[n].apply(e,i)}}function d(e){const t=e.length;if(0<t){const n=Array(t);for(let r=0;r<t;r++)n[r]=e[r];return n}return[]}function f(e,t){for(let n=1;n<arguments.length;n++){const t=arguments[n];if(s(t)){const n=e.length||0,r=t.length||0;e.length=n+r;for(let i=0;i<r;i++)e[n+i]=t[i]}else e.push(t)}}function p(e){return/^[\s\xa0]*$/.test(e)}function m(){var e=i.navigator;return e&&(e=e.userAgent)?e:""}function g(e){return g[" "](e),e}g[" "]=function(){};var y=!(-1==m().indexOf("Gecko")||-1!=m().toLowerCase().indexOf("webkit")&&-1==m().indexOf("Edge")||-1!=m().indexOf("Trident")||-1!=m().indexOf("MSIE")||-1!=m().indexOf("Edge"));function v(e,t,n){for(const r in e)t.call(n,e[r],r,e)}function w(e){const t={};for(const n in e)t[n]=e[n];return t}const b="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function I(e,t){let n,r;for(let i=1;i<arguments.length;i++){for(n in r=arguments[i],r)e[n]=r[n];for(let t=0;t<b.length;t++)n=b[t],Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}}function _(e){var t=1;e=e.split(":");const n=[];for(;0<t&&e.length;)n.push(e.shift()),t--;return e.length&&n.push(e.join(":")),n}function T(e){i.setTimeout(()=>{throw e},0)}function E(){var e=N;let t=null;return e.g&&(t=e.g,e.g=e.g.next,e.g||(e.h=null),t.next=null),t}var S=new class{constructor(e,t){this.i=e,this.j=t,this.h=0,this.g=null}get(){let e;return 0<this.h?(this.h--,e=this.g,this.g=e.next,e.next=null):e=this.i(),e}}(()=>new C,e=>e.reset());class C{constructor(){this.next=this.g=this.h=null}set(e,t){this.h=e,this.g=t,this.next=null}reset(){this.next=this.g=this.h=null}}let A,k=!1,N=new class{constructor(){this.h=this.g=null}add(e,t){const n=S.get();n.set(e,t),this.h?this.h.next=n:this.g=n,this.h=n}},D=()=>{const e=i.Promise.resolve(void 0);A=()=>{e.then(x)}};var x=()=>{for(var e;e=E();){try{e.h.call(e.g)}catch(n){T(n)}var t=S;t.j(e),100>t.h&&(t.h++,e.next=t.g,t.g=e)}k=!1};function R(){this.s=this.s,this.C=this.C}function O(e,t){this.type=e,this.g=this.target=t,this.defaultPrevented=!1}R.prototype.s=!1,R.prototype.ma=function(){this.s||(this.s=!0,this.N())},R.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()},O.prototype.h=function(){this.defaultPrevented=!0};var P=function(){if(!i.addEventListener||!Object.defineProperty)return!1;var e=!1,t=Object.defineProperty({},"passive",{get:function(){e=!0}});try{const e=()=>{};i.addEventListener("test",e,t),i.removeEventListener("test",e,t)}catch(n){}return e}();function L(e,t){if(O.call(this,e?e.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,e){var n=this.type=e.type,r=e.changedTouches&&e.changedTouches.length?e.changedTouches[0]:null;if(this.target=e.target||e.srcElement,this.g=t,t=e.relatedTarget){if(y){e:{try{g(t.nodeName);var i=!0;break e}catch(s){}i=!1}i||(t=null)}}else"mouseover"==n?t=e.fromElement:"mouseout"==n&&(t=e.toElement);this.relatedTarget=t,r?(this.clientX=void 0!==r.clientX?r.clientX:r.pageX,this.clientY=void 0!==r.clientY?r.clientY:r.pageY,this.screenX=r.screenX||0,this.screenY=r.screenY||0):(this.clientX=void 0!==e.clientX?e.clientX:e.pageX,this.clientY=void 0!==e.clientY?e.clientY:e.pageY,this.screenX=e.screenX||0,this.screenY=e.screenY||0),this.button=e.button,this.key=e.key||"",this.ctrlKey=e.ctrlKey,this.altKey=e.altKey,this.shiftKey=e.shiftKey,this.metaKey=e.metaKey,this.pointerId=e.pointerId||0,this.pointerType="string"==typeof e.pointerType?e.pointerType:M[e.pointerType]||"",this.state=e.state,this.i=e,e.defaultPrevented&&L.aa.h.call(this)}}h(L,O);var M={2:"touch",3:"pen",4:"mouse"};L.prototype.h=function(){L.aa.h.call(this);var e=this.i;e.preventDefault?e.preventDefault():e.returnValue=!1};var F="closure_listenable_"+(1e6*Math.random()|0),V=0;function U(e,t,n,r,i){this.listener=e,this.proxy=null,this.src=t,this.type=n,this.capture=!!r,this.ha=i,this.key=++V,this.da=this.fa=!1}function j(e){e.da=!0,e.listener=null,e.proxy=null,e.src=null,e.ha=null}function B(e){this.src=e,this.g={},this.h=0}function q(e,t){var n=t.type;if(n in e.g){var r,i=e.g[n],s=Array.prototype.indexOf.call(i,t,void 0);(r=0<=s)&&Array.prototype.splice.call(i,s,1),r&&(j(t),0==e.g[n].length&&(delete e.g[n],e.h--))}}function z(e,t,n,r){for(var i=0;i<e.length;++i){var s=e[i];if(!s.da&&s.listener==t&&s.capture==!!n&&s.ha==r)return i}return-1}B.prototype.add=function(e,t,n,r,i){var s=e.toString();(e=this.g[s])||(e=this.g[s]=[],this.h++);var o=z(e,t,r,i);return-1<o?(t=e[o],n||(t.fa=!1)):((t=new U(t,this.src,s,!!r,i)).fa=n,e.push(t)),t};var $="closure_lm_"+(1e6*Math.random()|0),K={};function G(e,t,n,r,i){if(Array.isArray(t)){for(var s=0;s<t.length;s++)G(e,t[s],n,r,i);return null}return n=Z(n),e&&e[F]?e.K(t,n,!!o(r)&&!!r.capture,i):function(e,t,n,r,i,s){if(!t)throw Error("Invalid event type");var a=o(i)?!!i.capture:!!i,c=X(e);if(c||(e[$]=c=new B(e)),n=c.add(t,n,r,a,s),n.proxy)return n;if(r=function(){function e(n){return t.call(e.src,e.listener,n)}const t=J;return e}(),n.proxy=r,r.src=e,r.listener=n,e.addEventListener)P||(i=a),void 0===i&&(i=!1),e.addEventListener(t.toString(),r,i);else if(e.attachEvent)e.attachEvent(Q(t.toString()),r);else{if(!e.addListener||!e.removeListener)throw Error("addEventListener and attachEvent are unavailable.");e.addListener(r)}return n}(e,t,n,!1,r,i)}function H(e,t,n,r,i){if(Array.isArray(t))for(var s=0;s<t.length;s++)H(e,t[s],n,r,i);else r=o(r)?!!r.capture:!!r,n=Z(n),e&&e[F]?(e=e.i,(t=String(t).toString())in e.g&&(-1<(n=z(s=e.g[t],n,r,i))&&(j(s[n]),Array.prototype.splice.call(s,n,1),0==s.length&&(delete e.g[t],e.h--)))):e&&(e=X(e))&&(t=e.g[t.toString()],e=-1,t&&(e=z(t,n,r,i)),(n=-1<e?t[e]:null)&&W(n))}function W(e){if("number"!=typeof e&&e&&!e.da){var t=e.src;if(t&&t[F])q(t.i,e);else{var n=e.type,r=e.proxy;t.removeEventListener?t.removeEventListener(n,r,e.capture):t.detachEvent?t.detachEvent(Q(n),r):t.addListener&&t.removeListener&&t.removeListener(r),(n=X(t))?(q(n,e),0==n.h&&(n.src=null,t[$]=null)):j(e)}}}function Q(e){return e in K?K[e]:K[e]="on"+e}function J(e,t){if(e.da)e=!0;else{t=new L(t,this);var n=e.listener,r=e.ha||e.src;e.fa&&W(e),e=n.call(r,t)}return e}function X(e){return(e=e[$])instanceof B?e:null}var Y="__closure_events_fn_"+(1e9*Math.random()>>>0);function Z(e){return"function"==typeof e?e:(e[Y]||(e[Y]=function(t){return e.handleEvent(t)}),e[Y])}function ee(){R.call(this),this.i=new B(this),this.M=this,this.F=null}function te(e,t){var n,r=e.F;if(r)for(n=[];r;r=r.F)n.push(r);if(e=e.M,r=t.type||t,"string"==typeof t)t=new O(t,e);else if(t instanceof O)t.target=t.target||e;else{var i=t;I(t=new O(r,e),i)}if(i=!0,n)for(var s=n.length-1;0<=s;s--){var o=t.g=n[s];i=ne(o,r,!0,t)&&i}if(i=ne(o=t.g=e,r,!0,t)&&i,i=ne(o,r,!1,t)&&i,n)for(s=0;s<n.length;s++)i=ne(o=t.g=n[s],r,!1,t)&&i}function ne(e,t,n,r){if(!(t=e.i.g[String(t)]))return!0;t=t.concat();for(var i=!0,s=0;s<t.length;++s){var o=t[s];if(o&&!o.da&&o.capture==n){var a=o.listener,c=o.ha||o.src;o.fa&&q(e.i,o),i=!1!==a.call(c,r)&&i}}return i&&!r.defaultPrevented}function re(e,t,n){if("function"==typeof e)n&&(e=u(e,n));else{if(!e||"function"!=typeof e.handleEvent)throw Error("Invalid listener argument");e=u(e.handleEvent,e)}return 2147483647<Number(t)?-1:i.setTimeout(e,t||0)}function ie(e){e.g=re(()=>{e.g=null,e.i&&(e.i=!1,ie(e))},e.l);const t=e.h;e.h=null,e.m.apply(null,t)}h(ee,R),ee.prototype[F]=!0,ee.prototype.removeEventListener=function(e,t,n,r){H(this,e,t,n,r)},ee.prototype.N=function(){if(ee.aa.N.call(this),this.i){var e,t=this.i;for(e in t.g){for(var n=t.g[e],r=0;r<n.length;r++)j(n[r]);delete t.g[e],t.h--}}this.F=null},ee.prototype.K=function(e,t,n,r){return this.i.add(String(e),t,!1,n,r)},ee.prototype.L=function(e,t,n,r){return this.i.add(String(e),t,!0,n,r)};class se extends R{constructor(e,t){super(),this.m=e,this.l=t,this.h=null,this.i=!1,this.g=null}j(e){this.h=arguments,this.g?this.i=!0:ie(this)}N(){super.N(),this.g&&(i.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function oe(e){R.call(this),this.h=e,this.g={}}h(oe,R);var ae=[];function ce(e){v(e.g,function(e,t){this.g.hasOwnProperty(t)&&W(e)},e),e.g={}}oe.prototype.N=function(){oe.aa.N.call(this),ce(this)},oe.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var ue=i.JSON.stringify,le=i.JSON.parse,he=class{stringify(e){return i.JSON.stringify(e,void 0)}parse(e){return i.JSON.parse(e,void 0)}};function de(){}function fe(e){return e.h||(e.h=e.i())}function pe(){}de.prototype.h=null;var me={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function ge(){O.call(this,"d")}function ye(){O.call(this,"c")}h(ge,O),h(ye,O);var ve={},we=null;function be(){return we=we||new ee}function Ie(e){O.call(this,ve.La,e)}function _e(e){const t=be();te(t,new Ie(t))}function Te(e,t){O.call(this,ve.STAT_EVENT,e),this.stat=t}function Ee(e){const t=be();te(t,new Te(t,e))}function Se(e,t){O.call(this,ve.Ma,e),this.size=t}function Ce(e,t){if("function"!=typeof e)throw Error("Fn must not be null and must be a function");return i.setTimeout(function(){e()},t)}function Ae(){this.g=!0}function ke(e,t,n,r){e.info(function(){return"XMLHTTP TEXT ("+t+"): "+function(e,t){if(!e.g)return t;if(!t)return null;try{var n=JSON.parse(t);if(n)for(e=0;e<n.length;e++)if(Array.isArray(n[e])){var r=n[e];if(!(2>r.length)){var i=r[1];if(Array.isArray(i)&&!(1>i.length)){var s=i[0];if("noop"!=s&&"stop"!=s&&"close"!=s)for(var o=1;o<i.length;o++)i[o]=""}}}return ue(n)}catch(a){return t}}(e,n)+(r?" "+r:"")})}ve.La="serverreachability",h(Ie,O),ve.STAT_EVENT="statevent",h(Te,O),ve.Ma="timingevent",h(Se,O),Ae.prototype.xa=function(){this.g=!1},Ae.prototype.info=function(){};var Ne,De={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},xe={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"};function Re(){}function Oe(e,t,n,r){this.j=e,this.i=t,this.l=n,this.R=r||1,this.U=new oe(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Pe}function Pe(){this.i=null,this.g="",this.h=!1}h(Re,de),Re.prototype.g=function(){return new XMLHttpRequest},Re.prototype.i=function(){return{}},Ne=new Re;var Le={},Me={};function Fe(e,t,n){e.L=1,e.v=ut(it(t)),e.m=n,e.P=!0,Ve(e,null)}function Ve(e,t){e.F=Date.now(),Be(e),e.A=it(e.v);var n=e.A,r=e.R;Array.isArray(r)||(r=[String(r)]),xt(n.i,"t",r),e.C=0,n=e.j.J,e.h=new Pe,e.g=wn(e.j,n?t:null,!e.m),0<e.O&&(e.M=new se(u(e.Y,e,e.g),e.O)),t=e.U,n=e.g,r=e.ca;var i="readystatechange";Array.isArray(i)||(i&&(ae[0]=i.toString()),i=ae);for(var s=0;s<i.length;s++){var o=G(n,i[s],r||t.handleEvent,!1,t.h||t);if(!o)break;t.g[o.key]=o}t=e.H?w(e.H):{},e.m?(e.u||(e.u="POST"),t["Content-Type"]="application/x-www-form-urlencoded",e.g.ea(e.A,e.u,e.m,t)):(e.u="GET",e.g.ea(e.A,e.u,null,t)),_e(),function(e,t,n,r,i,s){e.info(function(){if(e.g)if(s)for(var o="",a=s.split("&"),c=0;c<a.length;c++){var u=a[c].split("=");if(1<u.length){var l=u[0];u=u[1];var h=l.split("_");o=2<=h.length&&"type"==h[1]?o+(l+"=")+u+"&":o+(l+"=redacted&")}}else o=null;else o=s;return"XMLHTTP REQ ("+r+") [attempt "+i+"]: "+t+"\n"+n+"\n"+o})}(e.i,e.u,e.A,e.l,e.R,e.m)}function Ue(e){return!!e.g&&("GET"==e.u&&2!=e.L&&e.j.Ca)}function je(e,t){var n=e.C,r=t.indexOf("\n",n);return-1==r?Me:(n=Number(t.substring(n,r)),isNaN(n)?Le:(r+=1)+n>t.length?Me:(t=t.slice(r,r+n),e.C=r+n,t))}function Be(e){e.S=Date.now()+e.I,qe(e,e.I)}function qe(e,t){if(null!=e.B)throw Error("WatchDog timer not null");e.B=Ce(u(e.ba,e),t)}function ze(e){e.B&&(i.clearTimeout(e.B),e.B=null)}function $e(e){0==e.j.G||e.J||pn(e.j,e)}function Ke(e){ze(e);var t=e.M;t&&"function"==typeof t.ma&&t.ma(),e.M=null,ce(e.U),e.g&&(t=e.g,e.g=null,t.abort(),t.ma())}function Ge(e,t){try{var n=e.j;if(0!=n.G&&(n.g==e||Xe(n.h,e)))if(!e.K&&Xe(n.h,e)&&3==n.G){try{var r=n.Da.g.parse(t)}catch(l){r=null}if(Array.isArray(r)&&3==r.length){var i=r;if(0==i[0]){e:if(!n.u){if(n.g){if(!(n.g.F+3e3<e.F))break e;fn(n),nn(n)}ln(n),Ee(18)}}else n.za=i[1],0<n.za-n.T&&37500>i[2]&&n.F&&0==n.v&&!n.C&&(n.C=Ce(u(n.Za,n),6e3));if(1>=Je(n.h)&&n.ca){try{n.ca()}catch(l){}n.ca=void 0}}else gn(n,11)}else if((e.K||n.g==e)&&fn(n),!p(t))for(i=n.Da.g.parse(t),t=0;t<i.length;t++){let u=i[t];if(n.T=u[0],u=u[1],2==n.G)if("c"==u[0]){n.K=u[1],n.ia=u[2];const t=u[3];null!=t&&(n.la=t,n.j.info("VER="+n.la));const i=u[4];null!=i&&(n.Aa=i,n.j.info("SVER="+n.Aa));const l=u[5];null!=l&&"number"==typeof l&&0<l&&(r=1.5*l,n.L=r,n.j.info("backChannelRequestTimeoutMs_="+r)),r=n;const h=e.g;if(h){const e=h.g?h.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(e){var s=r.h;s.g||-1==e.indexOf("spdy")&&-1==e.indexOf("quic")&&-1==e.indexOf("h2")||(s.j=s.l,s.g=new Set,s.h&&(Ye(s,s.h),s.h=null))}if(r.D){const e=h.g?h.g.getResponseHeader("X-HTTP-Session-Id"):null;e&&(r.ya=e,ct(r.I,r.D,e))}}n.G=3,n.l&&n.l.ua(),n.ba&&(n.R=Date.now()-e.F,n.j.info("Handshake RTT: "+n.R+"ms"));var o=e;if((r=n).qa=vn(r,r.J?r.ia:null,r.W),o.K){Ze(r.h,o);var a=o,c=r.L;c&&(a.I=c),a.B&&(ze(a),Be(a)),r.g=o}else un(r);0<n.i.length&&sn(n)}else"stop"!=u[0]&&"close"!=u[0]||gn(n,7);else 3==n.G&&("stop"==u[0]||"close"==u[0]?"stop"==u[0]?gn(n,7):tn(n):"noop"!=u[0]&&n.l&&n.l.ta(u),n.v=0)}_e()}catch(l){}}Oe.prototype.ca=function(e){e=e.target;const t=this.M;t&&3==Xt(e)?t.j():this.Y(e)},Oe.prototype.Y=function(e){try{if(e==this.g)e:{const d=Xt(this.g);var t=this.g.Ba();this.g.Z();if(!(3>d)&&(3!=d||this.g&&(this.h.h||this.g.oa()||Yt(this.g)))){this.J||4!=d||7==t||_e(),ze(this);var n=this.g.Z();this.X=n;t:if(Ue(this)){var r=Yt(this.g);e="";var s=r.length,o=4==Xt(this.g);if(!this.h.i){if("undefined"==typeof TextDecoder){Ke(this),$e(this);var a="";break t}this.h.i=new i.TextDecoder}for(t=0;t<s;t++)this.h.h=!0,e+=this.h.i.decode(r[t],{stream:!(o&&t==s-1)});r.length=0,this.h.g+=e,this.C=0,a=this.h.g}else a=this.g.oa();if(this.o=200==n,function(e,t,n,r,i,s,o){e.info(function(){return"XMLHTTP RESP ("+r+") [ attempt "+i+"]: "+t+"\n"+n+"\n"+s+" "+o})}(this.i,this.u,this.A,this.l,this.R,d,n),this.o){if(this.T&&!this.K){t:{if(this.g){var c,u=this.g;if((c=u.g?u.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!p(c)){var l=c;break t}}l=null}if(!(n=l)){this.o=!1,this.s=3,Ee(12),Ke(this),$e(this);break e}ke(this.i,this.l,n,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Ge(this,n)}if(this.P){let e;for(n=!0;!this.J&&this.C<a.length;){if(e=je(this,a),e==Me){4==d&&(this.s=4,Ee(14),n=!1),ke(this.i,this.l,null,"[Incomplete Response]");break}if(e==Le){this.s=4,Ee(15),ke(this.i,this.l,a,"[Invalid Chunk]"),n=!1;break}ke(this.i,this.l,e,null),Ge(this,e)}if(Ue(this)&&0!=this.C&&(this.h.g=this.h.g.slice(this.C),this.C=0),4!=d||0!=a.length||this.h.h||(this.s=1,Ee(16),n=!1),this.o=this.o&&n,n){if(0<a.length&&!this.W){this.W=!0;var h=this.j;h.g==this&&h.ba&&!h.M&&(h.j.info("Great, no buffering proxy detected. Bytes received: "+a.length),hn(h),h.M=!0,Ee(11))}}else ke(this.i,this.l,a,"[Invalid Chunked Response]"),Ke(this),$e(this)}else ke(this.i,this.l,a,null),Ge(this,a);4==d&&Ke(this),this.o&&!this.J&&(4==d?pn(this.j,this):(this.o=!1,Be(this)))}else(function(e){const t={};e=(e.g&&2<=Xt(e)&&e.g.getAllResponseHeaders()||"").split("\r\n");for(let r=0;r<e.length;r++){if(p(e[r]))continue;var n=_(e[r]);const i=n[0];if("string"!=typeof(n=n[1]))continue;n=n.trim();const s=t[i]||[];t[i]=s,s.push(n)}!function(e,t){for(const n in e)t.call(void 0,e[n],n,e)}(t,function(e){return e.join(", ")})})(this.g),400==n&&0<a.indexOf("Unknown SID")?(this.s=3,Ee(12)):(this.s=0,Ee(13)),Ke(this),$e(this)}}}catch(d){}},Oe.prototype.cancel=function(){this.J=!0,Ke(this)},Oe.prototype.ba=function(){this.B=null;const e=Date.now();0<=e-this.S?(function(e,t){e.info(function(){return"TIMEOUT: "+t})}(this.i,this.A),2!=this.L&&(_e(),Ee(17)),Ke(this),this.s=2,$e(this)):qe(this,this.S-e)};var He=class{constructor(e,t){this.g=e,this.map=t}};function We(e){this.l=e||10,i.PerformanceNavigationTiming?e=0<(e=i.performance.getEntriesByType("navigation")).length&&("hq"==e[0].nextHopProtocol||"h2"==e[0].nextHopProtocol):e=!!(i.chrome&&i.chrome.loadTimes&&i.chrome.loadTimes()&&i.chrome.loadTimes().wasFetchedViaSpdy),this.j=e?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Qe(e){return!!e.h||!!e.g&&e.g.size>=e.j}function Je(e){return e.h?1:e.g?e.g.size:0}function Xe(e,t){return e.h?e.h==t:!!e.g&&e.g.has(t)}function Ye(e,t){e.g?e.g.add(t):e.h=t}function Ze(e,t){e.h&&e.h==t?e.h=null:e.g&&e.g.has(t)&&e.g.delete(t)}function et(e){if(null!=e.h)return e.i.concat(e.h.D);if(null!=e.g&&0!==e.g.size){let t=e.i;for(const n of e.g.values())t=t.concat(n.D);return t}return d(e.i)}function tt(e,t){if(e.forEach&&"function"==typeof e.forEach)e.forEach(t,void 0);else if(s(e)||"string"==typeof e)Array.prototype.forEach.call(e,t,void 0);else for(var n=function(e){if(e.na&&"function"==typeof e.na)return e.na();if(!e.V||"function"!=typeof e.V){if("undefined"!=typeof Map&&e instanceof Map)return Array.from(e.keys());if(!("undefined"!=typeof Set&&e instanceof Set)){if(s(e)||"string"==typeof e){var t=[];e=e.length;for(var n=0;n<e;n++)t.push(n);return t}t=[],n=0;for(const r in e)t[n++]=r;return t}}}(e),r=function(e){if(e.V&&"function"==typeof e.V)return e.V();if("undefined"!=typeof Map&&e instanceof Map||"undefined"!=typeof Set&&e instanceof Set)return Array.from(e.values());if("string"==typeof e)return e.split("");if(s(e)){for(var t=[],n=e.length,r=0;r<n;r++)t.push(e[r]);return t}for(r in t=[],n=0,e)t[n++]=e[r];return t}(e),i=r.length,o=0;o<i;o++)t.call(void 0,r[o],n&&n[o],e)}We.prototype.cancel=function(){if(this.i=et(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&0!==this.g.size){for(const e of this.g.values())e.cancel();this.g.clear()}};var nt=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function rt(e){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,e instanceof rt){this.h=e.h,st(this,e.j),this.o=e.o,this.g=e.g,ot(this,e.s),this.l=e.l;var t=e.i,n=new At;n.i=t.i,t.g&&(n.g=new Map(t.g),n.h=t.h),at(this,n),this.m=e.m}else e&&(t=String(e).match(nt))?(this.h=!1,st(this,t[1]||"",!0),this.o=lt(t[2]||""),this.g=lt(t[3]||"",!0),ot(this,t[4]),this.l=lt(t[5]||"",!0),at(this,t[6]||"",!0),this.m=lt(t[7]||"")):(this.h=!1,this.i=new At(null,this.h))}function it(e){return new rt(e)}function st(e,t,n){e.j=n?lt(t,!0):t,e.j&&(e.j=e.j.replace(/:$/,""))}function ot(e,t){if(t){if(t=Number(t),isNaN(t)||0>t)throw Error("Bad port number "+t);e.s=t}else e.s=null}function at(e,t,n){t instanceof At?(e.i=t,function(e,t){t&&!e.j&&(kt(e),e.i=null,e.g.forEach(function(e,t){var n=t.toLowerCase();t!=n&&(Nt(this,t),xt(this,n,e))},e)),e.j=t}(e.i,e.h)):(n||(t=ht(t,gt)),e.i=new At(t,e.h))}function ct(e,t,n){e.i.set(t,n)}function ut(e){return ct(e,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),e}function lt(e,t){return e?t?decodeURI(e.replace(/%25/g,"%2525")):decodeURIComponent(e):""}function ht(e,t,n){return"string"==typeof e?(e=encodeURI(e).replace(t,dt),n&&(e=e.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),e):null}function dt(e){return"%"+((e=e.charCodeAt(0))>>4&15).toString(16)+(15&e).toString(16)}rt.prototype.toString=function(){var e=[],t=this.j;t&&e.push(ht(t,ft,!0),":");var n=this.g;return(n||"file"==t)&&(e.push("//"),(t=this.o)&&e.push(ht(t,ft,!0),"@"),e.push(encodeURIComponent(String(n)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),null!=(n=this.s)&&e.push(":",String(n))),(n=this.l)&&(this.g&&"/"!=n.charAt(0)&&e.push("/"),e.push(ht(n,"/"==n.charAt(0)?mt:pt,!0))),(n=this.i.toString())&&e.push("?",n),(n=this.m)&&e.push("#",ht(n,Ct)),e.join("")};var ft=/[#\/\?@]/g,pt=/[#\?:]/g,mt=/[#\?]/g,gt=/[#\?@]/g,Ct=/#/g;function At(e,t){this.h=this.g=null,this.i=e||null,this.j=!!t}function kt(e){e.g||(e.g=new Map,e.h=0,e.i&&function(e,t){if(e){e=e.split("&");for(var n=0;n<e.length;n++){var r=e[n].indexOf("="),i=null;if(0<=r){var s=e[n].substring(0,r);i=e[n].substring(r+1)}else s=e[n];t(s,i?decodeURIComponent(i.replace(/\+/g," ")):"")}}}(e.i,function(t,n){e.add(decodeURIComponent(t.replace(/\+/g," ")),n)}))}function Nt(e,t){kt(e),t=Rt(e,t),e.g.has(t)&&(e.i=null,e.h-=e.g.get(t).length,e.g.delete(t))}function Dt(e,t){return kt(e),t=Rt(e,t),e.g.has(t)}function xt(e,t,n){Nt(e,t),0<n.length&&(e.i=null,e.g.set(Rt(e,t),d(n)),e.h+=n.length)}function Rt(e,t){return t=String(t),e.j&&(t=t.toLowerCase()),t}function Ot(e,t,n,r,i){try{i&&(i.onload=null,i.onerror=null,i.onabort=null,i.ontimeout=null),r(n)}catch(s){}}function Pt(){this.g=new he}function Lt(e,t,n){const r=n||"";try{tt(e,function(e,n){let i=e;o(e)&&(i=ue(e)),t.push(r+n+"="+encodeURIComponent(i))})}catch(i){throw t.push(r+"type="+encodeURIComponent("_badmap")),i}}function Mt(e){this.l=e.Ub||null,this.j=e.eb||!1}function Ft(e,t){ee.call(this),this.D=e,this.o=t,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}function Vt(e){e.j.read().then(e.Pa.bind(e)).catch(e.ga.bind(e))}function Ut(e){e.readyState=4,e.l=null,e.j=null,e.v=null,jt(e)}function jt(e){e.onreadystatechange&&e.onreadystatechange.call(e)}function Bt(e){let t="";return v(e,function(e,n){t+=n,t+=":",t+=e,t+="\r\n"}),t}function qt(e,t,n){e:{for(r in n){var r=!1;break e}r=!0}r||(n=Bt(n),"string"==typeof e?null!=n&&encodeURIComponent(String(n)):ct(e,t,n))}function zt(e){ee.call(this),this.headers=new Map,this.o=e||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}(e=At.prototype).add=function(e,t){kt(this),this.i=null,e=Rt(this,e);var n=this.g.get(e);return n||this.g.set(e,n=[]),n.push(t),this.h+=1,this},e.forEach=function(e,t){kt(this),this.g.forEach(function(n,r){n.forEach(function(n){e.call(t,n,r,this)},this)},this)},e.na=function(){kt(this);const e=Array.from(this.g.values()),t=Array.from(this.g.keys()),n=[];for(let r=0;r<t.length;r++){const i=e[r];for(let e=0;e<i.length;e++)n.push(t[r])}return n},e.V=function(e){kt(this);let t=[];if("string"==typeof e)Dt(this,e)&&(t=t.concat(this.g.get(Rt(this,e))));else{e=Array.from(this.g.values());for(let n=0;n<e.length;n++)t=t.concat(e[n])}return t},e.set=function(e,t){return kt(this),this.i=null,Dt(this,e=Rt(this,e))&&(this.h-=this.g.get(e).length),this.g.set(e,[t]),this.h+=1,this},e.get=function(e,t){return e&&0<(e=this.V(e)).length?String(e[0]):t},e.toString=function(){if(this.i)return this.i;if(!this.g)return"";const e=[],t=Array.from(this.g.keys());for(var n=0;n<t.length;n++){var r=t[n];const s=encodeURIComponent(String(r)),o=this.V(r);for(r=0;r<o.length;r++){var i=s;""!==o[r]&&(i+="="+encodeURIComponent(String(o[r]))),e.push(i)}}return this.i=e.join("&")},h(Mt,de),Mt.prototype.g=function(){return new Ft(this.l,this.j)},Mt.prototype.i=function(e){return function(){return e}}({}),h(Ft,ee),(e=Ft.prototype).open=function(e,t){if(0!=this.readyState)throw this.abort(),Error("Error reopening a connection");this.B=e,this.A=t,this.readyState=1,jt(this)},e.send=function(e){if(1!=this.readyState)throw this.abort(),Error("need to call open() first. ");this.g=!0;const t={headers:this.u,method:this.B,credentials:this.m,cache:void 0};e&&(t.body=e),(this.D||i).fetch(new Request(this.A,t)).then(this.Sa.bind(this),this.ga.bind(this))},e.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&4!=this.readyState&&(this.g=!1,Ut(this)),this.readyState=0},e.Sa=function(e){if(this.g&&(this.l=e,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=e.headers,this.readyState=2,jt(this)),this.g&&(this.readyState=3,jt(this),this.g)))if("arraybuffer"===this.responseType)e.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(void 0!==i.ReadableStream&&"body"in e){if(this.j=e.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Vt(this)}else e.text().then(this.Ra.bind(this),this.ga.bind(this))},e.Pa=function(e){if(this.g){if(this.o&&e.value)this.response.push(e.value);else if(!this.o){var t=e.value?e.value:new Uint8Array(0);(t=this.v.decode(t,{stream:!e.done}))&&(this.response=this.responseText+=t)}e.done?Ut(this):jt(this),3==this.readyState&&Vt(this)}},e.Ra=function(e){this.g&&(this.response=this.responseText=e,Ut(this))},e.Qa=function(e){this.g&&(this.response=e,Ut(this))},e.ga=function(){this.g&&Ut(this)},e.setRequestHeader=function(e,t){this.u.append(e,t)},e.getResponseHeader=function(e){return this.h&&this.h.get(e.toLowerCase())||""},e.getAllResponseHeaders=function(){if(!this.h)return"";const e=[],t=this.h.entries();for(var n=t.next();!n.done;)n=n.value,e.push(n[0]+": "+n[1]),n=t.next();return e.join("\r\n")},Object.defineProperty(Ft.prototype,"withCredentials",{get:function(){return"include"===this.m},set:function(e){this.m=e?"include":"same-origin"}}),h(zt,ee);var $t=/^https?$/i,Kt=["POST","PUT"];function Gt(e,t){e.h=!1,e.g&&(e.j=!0,e.g.abort(),e.j=!1),e.l=t,e.m=5,Ht(e),Qt(e)}function Ht(e){e.A||(e.A=!0,te(e,"complete"),te(e,"error"))}function Wt(e){if(e.h&&void 0!==r&&(!e.v[1]||4!=Xt(e)||2!=e.Z()))if(e.u&&4==Xt(e))re(e.Ea,0,e);else if(te(e,"readystatechange"),4==Xt(e)){e.h=!1;try{const r=e.Z();e:switch(r){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var t=!0;break e;default:t=!1}var n;if(!(n=t)){var s;if(s=0===r){var o=String(e.D).match(nt)[1]||null;!o&&i.self&&i.self.location&&(o=i.self.location.protocol.slice(0,-1)),s=!$t.test(o?o.toLowerCase():"")}n=s}if(n)te(e,"complete"),te(e,"success");else{e.m=6;try{var a=2<Xt(e)?e.g.statusText:""}catch(c){a=""}e.l=a+" ["+e.Z()+"]",Ht(e)}}finally{Qt(e)}}}function Qt(e,t){if(e.g){Jt(e);const r=e.g,i=e.v[0]?()=>{}:null;e.g=null,e.v=null,t||te(e,"ready");try{r.onreadystatechange=i}catch(n){}}}function Jt(e){e.I&&(i.clearTimeout(e.I),e.I=null)}function Xt(e){return e.g?e.g.readyState:0}function Yt(e){try{if(!e.g)return null;if("response"in e.g)return e.g.response;switch(e.H){case"":case"text":return e.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in e.g)return e.g.mozResponseArrayBuffer}return null}catch(t){return null}}function Zt(e,t,n){return n&&n.internalChannelParams&&n.internalChannelParams[e]||t}function en(e){this.Aa=0,this.i=[],this.j=new Ae,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Zt("failFast",!1,e),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Zt("baseRetryDelayMs",5e3,e),this.cb=Zt("retryDelaySeedMs",1e4,e),this.Wa=Zt("forwardChannelMaxRetries",2,e),this.wa=Zt("forwardChannelRequestTimeoutMs",2e4,e),this.pa=e&&e.xmlHttpFactory||void 0,this.Xa=e&&e.Tb||void 0,this.Ca=e&&e.useFetchStreams||!1,this.L=void 0,this.J=e&&e.supportsCrossDomainXhr||!1,this.K="",this.h=new We(e&&e.concurrentRequestLimit),this.Da=new Pt,this.P=e&&e.fastHandshake||!1,this.O=e&&e.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=e&&e.Rb||!1,e&&e.xa&&this.j.xa(),e&&e.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&e&&e.detectBufferingProxy||!1,this.ja=void 0,e&&e.longPollingTimeout&&0<e.longPollingTimeout&&(this.ja=e.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}function tn(e){if(rn(e),3==e.G){var t=e.U++,n=it(e.I);if(ct(n,"SID",e.K),ct(n,"RID",t),ct(n,"TYPE","terminate"),an(e,n),(t=new Oe(e,e.j,t)).L=2,t.v=ut(it(n)),n=!1,i.navigator&&i.navigator.sendBeacon)try{n=i.navigator.sendBeacon(t.v.toString(),"")}catch(r){}!n&&i.Image&&((new Image).src=t.v,n=!0),n||(t.g=wn(t.j,null),t.g.ea(t.v)),t.F=Date.now(),Be(t)}yn(e)}function nn(e){e.g&&(hn(e),e.g.cancel(),e.g=null)}function rn(e){nn(e),e.u&&(i.clearTimeout(e.u),e.u=null),fn(e),e.h.cancel(),e.s&&("number"==typeof e.s&&i.clearTimeout(e.s),e.s=null)}function sn(e){if(!Qe(e.h)&&!e.s){e.s=!0;var t=e.Ga;A||D(),k||(A(),k=!0),N.add(t,e),e.B=0}}function on(e,t){var n;n=t?t.l:e.U++;const r=it(e.I);ct(r,"SID",e.K),ct(r,"RID",n),ct(r,"AID",e.T),an(e,r),e.m&&e.o&&qt(r,e.m,e.o),n=new Oe(e,e.j,n,e.B+1),null===e.m&&(n.H=e.o),t&&(e.i=t.D.concat(e.i)),t=cn(e,n,1e3),n.I=Math.round(.5*e.wa)+Math.round(.5*e.wa*Math.random()),Ye(e.h,n),Fe(n,r,t)}function an(e,t){e.H&&v(e.H,function(e,n){ct(t,n,e)}),e.l&&tt({},function(e,n){ct(t,n,e)})}function cn(e,t,n){n=Math.min(e.i.length,n);var r=e.l?u(e.l.Na,e.l,e):null;e:{var i=e.i;let t=-1;for(;;){const e=["count="+n];-1==t?0<n?(t=i[0].g,e.push("ofs="+t)):t=0:e.push("ofs="+t);let o=!0;for(let a=0;a<n;a++){let n=i[a].g;const c=i[a].map;if(n-=t,0>n)t=Math.max(0,i[a].g-100),o=!1;else try{Lt(c,e,"req"+n+"_")}catch(s){r&&r(c)}}if(o){r=e.join("&");break e}}}return e=e.i.splice(0,n),t.D=e,r}function un(e){if(!e.g&&!e.u){e.Y=1;var t=e.Fa;A||D(),k||(A(),k=!0),N.add(t,e),e.v=0}}function ln(e){return!(e.g||e.u||3<=e.v)&&(e.Y++,e.u=Ce(u(e.Fa,e),mn(e,e.v)),e.v++,!0)}function hn(e){null!=e.A&&(i.clearTimeout(e.A),e.A=null)}function dn(e){e.g=new Oe(e,e.j,"rpc",e.Y),null===e.m&&(e.g.H=e.o),e.g.O=0;var t=it(e.qa);ct(t,"RID","rpc"),ct(t,"SID",e.K),ct(t,"AID",e.T),ct(t,"CI",e.F?"0":"1"),!e.F&&e.ja&&ct(t,"TO",e.ja),ct(t,"TYPE","xmlhttp"),an(e,t),e.m&&e.o&&qt(t,e.m,e.o),e.L&&(e.g.I=e.L);var n=e.g;e=e.ia,n.L=1,n.v=ut(it(t)),n.m=null,n.P=!0,Ve(n,e)}function fn(e){null!=e.C&&(i.clearTimeout(e.C),e.C=null)}function pn(e,t){var n=null;if(e.g==t){fn(e),hn(e),e.g=null;var r=2}else{if(!Xe(e.h,t))return;n=t.D,Ze(e.h,t),r=1}if(0!=e.G)if(t.o)if(1==r){n=t.m?t.m.length:0,t=Date.now()-t.F;var i=e.B;te(r=be(),new Se(r,n)),sn(e)}else un(e);else if(3==(i=t.s)||0==i&&0<t.X||!(1==r&&function(e,t){return!(Je(e.h)>=e.h.j-(e.s?1:0)||(e.s?(e.i=t.D.concat(e.i),0):1==e.G||2==e.G||e.B>=(e.Va?0:e.Wa)||(e.s=Ce(u(e.Ga,e,t),mn(e,e.B)),e.B++,0)))}(e,t)||2==r&&ln(e)))switch(n&&0<n.length&&(t=e.h,t.i=t.i.concat(n)),i){case 1:gn(e,5);break;case 4:gn(e,10);break;case 3:gn(e,6);break;default:gn(e,2)}}function mn(e,t){let n=e.Ta+Math.floor(Math.random()*e.cb);return e.isActive()||(n*=2),n*t}function gn(e,t){if(e.j.info("Error code "+t),2==t){var n=u(e.fb,e),r=e.Xa;const t=!r;r=new rt(r||"//www.google.com/images/cleardot.gif"),i.location&&"http"==i.location.protocol||st(r,"https"),ut(r),t?function(e,t){const n=new Ae;if(i.Image){const r=new Image;r.onload=l(Ot,n,"TestLoadImage: loaded",!0,t,r),r.onerror=l(Ot,n,"TestLoadImage: error",!1,t,r),r.onabort=l(Ot,n,"TestLoadImage: abort",!1,t,r),r.ontimeout=l(Ot,n,"TestLoadImage: timeout",!1,t,r),i.setTimeout(function(){r.ontimeout&&r.ontimeout()},1e4),r.src=e}else t(!1)}(r.toString(),n):function(e,t){new Ae;const n=new AbortController,r=setTimeout(()=>{n.abort(),Ot(0,0,!1,t)},1e4);fetch(e,{signal:n.signal}).then(e=>{clearTimeout(r),e.ok?Ot(0,0,!0,t):Ot(0,0,!1,t)}).catch(()=>{clearTimeout(r),Ot(0,0,!1,t)})}(r.toString(),n)}else Ee(2);e.G=0,e.l&&e.l.sa(t),yn(e),rn(e)}function yn(e){if(e.G=0,e.ka=[],e.l){const t=et(e.h);0==t.length&&0==e.i.length||(f(e.ka,t),f(e.ka,e.i),e.h.i.length=0,d(e.i),e.i.length=0),e.l.ra()}}function vn(e,t,n){var r=n instanceof rt?it(n):new rt(n);if(""!=r.g)t&&(r.g=t+"."+r.g),ot(r,r.s);else{var s=i.location;r=s.protocol,t=t?t+"."+s.hostname:s.hostname,s=+s.port;var o=new rt(null);r&&st(o,r),t&&(o.g=t),s&&ot(o,s),n&&(o.l=n),r=o}return n=e.D,t=e.ya,n&&t&&ct(r,n,t),ct(r,"VER",e.la),an(e,r),r}function wn(e,t,n){if(t&&!e.J)throw Error("Can't create secondary domain capable XhrIo object.");return(t=e.Ca&&!e.pa?new zt(new Mt({eb:n})):new zt(e.pa)).Ha(e.J),t}function bn(){}function In(){}function _n(e,t){ee.call(this),this.g=new en(t),this.l=e,this.h=t&&t.messageUrlParams||null,e=t&&t.messageHeaders||null,t&&t.clientProtocolHeaderRequired&&(e?e["X-Client-Protocol"]="webchannel":e={"X-Client-Protocol":"webchannel"}),this.g.o=e,e=t&&t.initMessageHeaders||null,t&&t.messageContentType&&(e?e["X-WebChannel-Content-Type"]=t.messageContentType:e={"X-WebChannel-Content-Type":t.messageContentType}),t&&t.va&&(e?e["X-WebChannel-Client-Profile"]=t.va:e={"X-WebChannel-Client-Profile":t.va}),this.g.S=e,(e=t&&t.Sb)&&!p(e)&&(this.g.m=e),this.v=t&&t.supportsCrossDomainXhr||!1,this.u=t&&t.sendRawJson||!1,(t=t&&t.httpSessionIdParam)&&!p(t)&&(this.g.D=t,null!==(e=this.h)&&t in e&&(t in(e=this.h)&&delete e[t])),this.j=new Sn(this)}function Tn(e){ge.call(this),e.__headers__&&(this.headers=e.__headers__,this.statusCode=e.__status__,delete e.__headers__,delete e.__status__);var t=e.__sm__;if(t){e:{for(const n in t){e=n;break e}e=void 0}(this.i=e)&&(e=this.i,t=null!==t&&e in t?t[e]:void 0),this.data=t}else this.data=e}function En(){ye.call(this),this.status=1}function Sn(e){this.g=e}(e=zt.prototype).Ha=function(e){this.J=e},e.ea=function(e,t,n,r){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+e);t=t?t.toUpperCase():"GET",this.D=e,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Ne.g(),this.v=this.o?fe(this.o):fe(Ne),this.g.onreadystatechange=u(this.Ea,this);try{this.B=!0,this.g.open(t,String(e),!0),this.B=!1}catch(o){return void Gt(this,o)}if(e=n||"",n=new Map(this.headers),r)if(Object.getPrototypeOf(r)===Object.prototype)for(var s in r)n.set(s,r[s]);else{if("function"!=typeof r.keys||"function"!=typeof r.get)throw Error("Unknown input type for opt_headers: "+String(r));for(const e of r.keys())n.set(e,r.get(e))}r=Array.from(n.keys()).find(e=>"content-type"==e.toLowerCase()),s=i.FormData&&e instanceof i.FormData,!(0<=Array.prototype.indexOf.call(Kt,t,void 0))||r||s||n.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[i,a]of n)this.g.setRequestHeader(i,a);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Jt(this),this.u=!0,this.g.send(e),this.u=!1}catch(o){Gt(this,o)}},e.abort=function(e){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=e||7,te(this,"complete"),te(this,"abort"),Qt(this))},e.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Qt(this,!0)),zt.aa.N.call(this)},e.Ea=function(){this.s||(this.B||this.u||this.j?Wt(this):this.bb())},e.bb=function(){Wt(this)},e.isActive=function(){return!!this.g},e.Z=function(){try{return 2<Xt(this)?this.g.status:-1}catch(e){return-1}},e.oa=function(){try{return this.g?this.g.responseText:""}catch(e){return""}},e.Oa=function(e){if(this.g){var t=this.g.responseText;return e&&0==t.indexOf(e)&&(t=t.substring(e.length)),le(t)}},e.Ba=function(){return this.m},e.Ka=function(){return"string"==typeof this.l?this.l:String(this.l)},(e=en.prototype).la=8,e.G=1,e.connect=function(e,t,n,r){Ee(0),this.W=e,this.H=t||{},n&&void 0!==r&&(this.H.OSID=n,this.H.OAID=r),this.F=this.X,this.I=vn(this,null,this.W),sn(this)},e.Ga=function(e){if(this.s)if(this.s=null,1==this.G){if(!e){this.U=Math.floor(1e5*Math.random()),e=this.U++;const i=new Oe(this,this.j,e);let s=this.o;if(this.S&&(s?(s=w(s),I(s,this.S)):s=this.S),null!==this.m||this.O||(i.H=s,s=null),this.P)e:{for(var t=0,n=0;n<this.i.length;n++){var r=this.i[n];if(void 0===(r="__data__"in r.map&&"string"==typeof(r=r.map.__data__)?r.length:void 0))break;if(4096<(t+=r)){t=n;break e}if(4096===t||n===this.i.length-1){t=n+1;break e}}t=1e3}else t=1e3;t=cn(this,i,t),ct(n=it(this.I),"RID",e),ct(n,"CVER",22),this.D&&ct(n,"X-HTTP-Session-Id",this.D),an(this,n),s&&(this.O?t="headers="+encodeURIComponent(String(Bt(s)))+"&"+t:this.m&&qt(n,this.m,s)),Ye(this.h,i),this.Ua&&ct(n,"TYPE","init"),this.P?(ct(n,"$req",t),ct(n,"SID","null"),i.T=!0,Fe(i,n,null)):Fe(i,n,t),this.G=2}}else 3==this.G&&(e?on(this,e):0==this.i.length||Qe(this.h)||on(this))},e.Fa=function(){if(this.u=null,dn(this),this.ba&&!(this.M||null==this.g||0>=this.R)){var e=2*this.R;this.j.info("BP detection timer enabled: "+e),this.A=Ce(u(this.ab,this),e)}},e.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Ee(10),nn(this),dn(this))},e.Za=function(){null!=this.C&&(this.C=null,nn(this),ln(this),Ee(19))},e.fb=function(e){e?(this.j.info("Successfully pinged google.com"),Ee(2)):(this.j.info("Failed to ping google.com"),Ee(1))},e.isActive=function(){return!!this.l&&this.l.isActive(this)},(e=bn.prototype).ua=function(){},e.ta=function(){},e.sa=function(){},e.ra=function(){},e.isActive=function(){return!0},e.Na=function(){},In.prototype.g=function(e,t){return new _n(e,t)},h(_n,ee),_n.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},_n.prototype.close=function(){tn(this.g)},_n.prototype.o=function(e){var t=this.g;if("string"==typeof e){var n={};n.__data__=e,e=n}else this.u&&((n={}).__data__=ue(e),e=n);t.i.push(new He(t.Ya++,e)),3==t.G&&sn(t)},_n.prototype.N=function(){this.g.l=null,delete this.j,tn(this.g),delete this.g,_n.aa.N.call(this)},h(Tn,ge),h(En,ye),h(Sn,bn),Sn.prototype.ua=function(){te(this.g,"a")},Sn.prototype.ta=function(e){te(this.g,new Tn(e))},Sn.prototype.sa=function(e){te(this.g,new En)},Sn.prototype.ra=function(){te(this.g,"b")},In.prototype.createWebChannel=In.prototype.g,_n.prototype.send=_n.prototype.o,_n.prototype.open=_n.prototype.m,_n.prototype.close=_n.prototype.close,Et=function(){return new In},Tt=function(){return be()},_t=ve,It={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},De.NO_ERROR=0,De.TIMEOUT=8,De.HTTP_ERROR=6,bt=De,xe.COMPLETE="complete",wt=xe,pe.EventType=me,me.OPEN="a",me.CLOSE="b",me.ERROR="c",me.MESSAGE="d",ee.prototype.listen=ee.prototype.K,vt=pe,zt.prototype.listenOnce=zt.prototype.L,zt.prototype.getLastError=zt.prototype.Ka,zt.prototype.getLastErrorCode=zt.prototype.Ba,zt.prototype.getStatus=zt.prototype.Z,zt.prototype.getResponseJson=zt.prototype.Oa,zt.prototype.getResponseText=zt.prototype.oa,zt.prototype.send=zt.prototype.ea,zt.prototype.setWithCredentials=zt.prototype.Ha,yt=zt}).apply(void 0!==St?St:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});const Ct="@firebase/firestore",At="4.8.0";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kt{constructor(e){this.uid=e}isAuthenticated(){return null!=this.uid}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}kt.UNAUTHENTICATED=new kt(null),kt.GOOGLE_CREDENTIALS=new kt("google-credentials-uid"),kt.FIRST_PARTY=new kt("first-party-uid"),kt.MOCK_USER=new kt("mock-user");
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let Nt="11.10.0";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dt=new Q("@firebase/firestore");function xt(){return Dt.logLevel}function Rt(e,...t){if(Dt.logLevel<=z.DEBUG){const n=t.map(Lt);Dt.debug(`Firestore (${Nt}): ${e}`,...n)}}function Ot(e,...t){if(Dt.logLevel<=z.ERROR){const n=t.map(Lt);Dt.error(`Firestore (${Nt}): ${e}`,...n)}}function Pt(e,...t){if(Dt.logLevel<=z.WARN){const n=t.map(Lt);Dt.warn(`Firestore (${Nt}): ${e}`,...n)}}function Lt(e){if("string"==typeof e)return e;try{
/**
    * @license
    * Copyright 2020 Google LLC
    *
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    *   http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    */
return t=e,JSON.stringify(t)}catch(n){return e}var t}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mt(e,t,n){let r="Unexpected state";"string"==typeof t?r=t:n=t,Ft(e,r,n)}function Ft(e,t,n){let r=`FIRESTORE (${Nt}) INTERNAL ASSERTION FAILED: ${t} (ID: ${e.toString(16)})`;if(void 0!==n)try{r+=" CONTEXT: "+JSON.stringify(n)}catch(i){r+=" CONTEXT: "+n}throw Ot(r),new Error(r)}function Vt(e,t,n,r){let i="Unexpected state";"string"==typeof n?i=n:r=n,e||Ft(t,i,r)}function Ut(e,t){return e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jt={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class Bt extends A{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qt{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zt{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class $t{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(kt.UNAUTHENTICATED))}shutdown(){}}class Kt{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class Gt{constructor(e){this.t=e,this.currentUser=kt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Vt(void 0===this.o,42304);let n=this.i;const r=e=>this.i!==n?(n=this.i,t(e)):Promise.resolve();let i=new qt;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new qt,e.enqueueRetryable(()=>r(this.currentUser))};const s=()=>{const t=i;e.enqueueRetryable(async()=>{await t.promise,await r(this.currentUser)})},o=e=>{Rt("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=e,this.o&&(this.auth.addAuthTokenListener(this.o),s())};this.t.onInit(e=>o(e)),setTimeout(()=>{if(!this.auth){const e=this.t.getImmediate({optional:!0});e?o(e):(Rt("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new qt)}},0),s()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(t=>this.i!==e?(Rt("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):t?(Vt("string"==typeof t.accessToken,31837,{l:t}),new zt(t.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Vt(null===e||"string"==typeof e,2055,{h:e}),new kt(e)}}class Ht{constructor(e,t,n){this.P=e,this.T=t,this.I=n,this.type="FirstParty",this.user=kt.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class Wt{constructor(e,t,n){this.P=e,this.T=t,this.I=n}getToken(){return Promise.resolve(new Ht(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable(()=>t(kt.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Qt{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Jt{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Xe(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Vt(void 0===this.o,3512);const n=e=>{null!=e.error&&Rt("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${e.error.message}`);const n=e.token!==this.m;return this.m=e.token,Rt("FirebaseAppCheckTokenProvider",`Received ${n?"new":"existing"} token.`),n?t(e.token):Promise.resolve()};this.o=t=>{e.enqueueRetryable(()=>n(t))};const r=e=>{Rt("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=e,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(e=>r(e)),setTimeout(()=>{if(!this.appCheck){const e=this.V.getImmediate({optional:!0});e?r(e):Rt("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new Qt(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(e=>e?(Vt("string"==typeof e.token,44558,{tokenResult:e}),this.m=e.token,new Qt(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Xt(e){const t="undefined"!=typeof self&&(self.crypto||self.msCrypto),n=new Uint8Array(e);if(t&&"function"==typeof t.getRandomValues)t.getRandomValues(n);else for(let r=0;r<e;r++)n[r]=Math.floor(256*Math.random());return n}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yt(){return new TextEncoder}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zt{static newId(){const e=62*Math.floor(256/62);let t="";for(;t.length<20;){const n=Xt(40);for(let r=0;r<n.length;++r)t.length<20&&n[r]<e&&(t+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(n[r]%62))}return t}}function en(e,t){return e<t?-1:e>t?1:0}function tn(e,t){let n=0;for(;n<e.length&&n<t.length;){const r=e.codePointAt(n),i=t.codePointAt(n);if(r!==i){if(r<128&&i<128)return en(r,i);{const s=Yt(),o=rn(s.encode(nn(e,n)),s.encode(nn(t,n)));return 0!==o?o:en(r,i)}}n+=r>65535?2:1}return en(e.length,t.length)}function nn(e,t){return e.codePointAt(t)>65535?e.substring(t,t+2):e.substring(t,t+1)}function rn(e,t){for(let n=0;n<e.length&&n<t.length;++n)if(e[n]!==t[n])return en(e[n],t[n]);return en(e.length,t.length)}function sn(e,t,n){return e.length===t.length&&e.every((e,r)=>n(e,t[r]))}function on(e){return e+"\0"}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const an="__name__";class cn{constructor(e,t,n){void 0===t?t=0:t>e.length&&Mt(637,{offset:t,range:e.length}),void 0===n?n=e.length-t:n>e.length-t&&Mt(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return 0===cn.comparator(this,e)}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof cn?e.forEach(e=>{t.push(e)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=void 0===e?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return 0===this.length}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let r=0;r<n;r++){const n=cn.compareSegments(e.get(r),t.get(r));if(0!==n)return n}return en(e.length,t.length)}static compareSegments(e,t){const n=cn.isNumericId(e),r=cn.isNumericId(t);return n&&!r?-1:!n&&r?1:n&&r?cn.extractNumericId(e).compare(cn.extractNumericId(t)):tn(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return pt.fromString(e.substring(4,e.length-2))}}class un extends cn{construct(e,t,n){return new un(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new Bt(jt.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter(e=>e.length>0))}return new un(t)}static emptyPath(){return new un([])}}const ln=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class hn extends cn{construct(e,t,n){return new hn(e,t,n)}static isValidIdentifier(e){return ln.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),hn.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return 1===this.length&&this.get(0)===an}static keyField(){return new hn([an])}static fromServerFormat(e){const t=[];let n="",r=0;const i=()=>{if(0===n.length)throw new Bt(jt.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let s=!1;for(;r<e.length;){const t=e[r];if("\\"===t){if(r+1===e.length)throw new Bt(jt.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const t=e[r+1];if("\\"!==t&&"."!==t&&"`"!==t)throw new Bt(jt.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=t,r+=2}else"`"===t?(s=!s,r++):"."!==t||s?(n+=t,r++):(i(),r++)}if(i(),s)throw new Bt(jt.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new hn(t)}static emptyPath(){return new hn([])}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dn{constructor(e){this.path=e}static fromPath(e){return new dn(un.fromString(e))}static fromName(e){return new dn(un.fromString(e).popFirst(5))}static empty(){return new dn(un.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return null!==e&&0===un.comparator(this.path,e.path)}toString(){return this.path.toString()}static comparator(e,t){return un.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new dn(new un(e.slice()))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fn(e,t,n){if(!n)throw new Bt(jt.INVALID_ARGUMENT,`Function ${e}() cannot be called with an empty ${t}.`)}function pn(e,t,n,r){if(!0===t&&!0===r)throw new Bt(jt.INVALID_ARGUMENT,`${e} and ${n} cannot be used together.`)}function mn(e){if(!dn.isDocumentKey(e))throw new Bt(jt.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`)}function gn(e){if(dn.isDocumentKey(e))throw new Bt(jt.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`)}function yn(e){return"object"==typeof e&&null!==e&&(Object.getPrototypeOf(e)===Object.prototype||null===Object.getPrototypeOf(e))}function vn(e){if(void 0===e)return"undefined";if(null===e)return"null";if("string"==typeof e)return e.length>20&&(e=`${e.substring(0,20)}...`),JSON.stringify(e);if("number"==typeof e||"boolean"==typeof e)return""+e;if("object"==typeof e){if(e instanceof Array)return"an array";{const n=(t=e).constructor?t.constructor.name:null;return n?`a custom ${n} object`:"an object"}}var t;return"function"==typeof e?"a function":Mt(12329,{type:typeof e})}function wn(e,t){if("_delegate"in e&&(e=e._delegate),!(e instanceof t)){if(t.name===e.constructor.name)throw new Bt(jt.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=vn(e);throw new Bt(jt.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${n}`)}}return e}function bn(e,t){if(t<=0)throw new Bt(jt.INVALID_ARGUMENT,`Function ${e}() requires a positive number, but it was: ${t}.`)}
/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function In(e,t){const n={typeString:e};return t&&(n.value=t),n}function _n(e,t){if(!yn(e))throw new Bt(jt.INVALID_ARGUMENT,"JSON must be an object");let n;for(const r in t)if(t[r]){const i=t[r].typeString,s="value"in t[r]?{value:t[r].value}:void 0;if(!(r in e)){n=`JSON missing required field: '${r}'`;break}const o=e[r];if(i&&typeof o!==i){n=`JSON field '${r}' must be a ${i}.`;break}if(void 0!==s&&o!==s.value){n=`Expected '${r}' field to equal '${s.value}'`;break}}if(n)throw new Bt(jt.INVALID_ARGUMENT,n);return!0}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tn=-62135596800,En=1e6;class Sn{static now(){return Sn.fromMillis(Date.now())}static fromDate(e){return Sn.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor((e-1e3*t)*En);return new Sn(t,n)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new Bt(jt.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new Bt(jt.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Tn)throw new Bt(jt.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new Bt(jt.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/En}_compareTo(e){return this.seconds===e.seconds?en(this.nanoseconds,e.nanoseconds):en(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Sn._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(_n(e,Sn._jsonSchema))return new Sn(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Tn;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Sn._jsonSchemaVersion="firestore/timestamp/1.0",Sn._jsonSchema={type:In("string",Sn._jsonSchemaVersion),seconds:In("number"),nanoseconds:In("number")};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Cn{static fromTimestamp(e){return new Cn(e)}static min(){return new Cn(new Sn(0,0))}static max(){return new Cn(new Sn(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const An=-1;class kn{constructor(e,t,n,r){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=r}}function Nn(e){return e.fields.find(e=>2===e.kind)}function Dn(e){return e.fields.filter(e=>2!==e.kind)}function xn(e,t){let n=en(e.collectionGroup,t.collectionGroup);if(0!==n)return n;for(let r=0;r<Math.min(e.fields.length,t.fields.length);++r)if(n=On(e.fields[r],t.fields[r]),0!==n)return n;return en(e.fields.length,t.fields.length)}kn.UNKNOWN_ID=-1;class Rn{constructor(e,t){this.fieldPath=e,this.kind=t}}function On(e,t){const n=hn.comparator(e.fieldPath,t.fieldPath);return 0!==n?n:en(e.kind,t.kind)}class Pn{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new Pn(0,Fn.min())}}function Ln(e,t){const n=e.toTimestamp().seconds,r=e.toTimestamp().nanoseconds+1,i=Cn.fromTimestamp(1e9===r?new Sn(n+1,0):new Sn(n,r));return new Fn(i,dn.empty(),t)}function Mn(e){return new Fn(e.readTime,e.key,An)}class Fn{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new Fn(Cn.min(),dn.empty(),An)}static max(){return new Fn(Cn.max(),dn.empty(),An)}}function Vn(e,t){let n=e.readTime.compareTo(t.readTime);return 0!==n?n:(n=dn.comparator(e.documentKey,t.documentKey),0!==n?n:en(e.largestBatchId,t.largestBatchId)
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */)}const Un="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class jn{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Bn(e){if(e.code!==jt.FAILED_PRECONDITION||e.message!==Un)throw e;Rt("LocalStore","Unexpectedly lost primary lease")}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qn{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)},e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&Mt(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new qn((n,r)=>{this.nextCallback=t=>{this.wrapSuccess(e,t).next(n,r)},this.catchCallback=e=>{this.wrapFailure(t,e).next(n,r)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof qn?t:qn.resolve(t)}catch(t){return qn.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):qn.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):qn.reject(t)}static resolve(e){return new qn((t,n)=>{t(e)})}static reject(e){return new qn((t,n)=>{n(e)})}static waitFor(e){return new qn((t,n)=>{let r=0,i=0,s=!1;e.forEach(e=>{++r,e.next(()=>{++i,s&&i===r&&t()},e=>n(e))}),s=!0,i===r&&t()})}static or(e){let t=qn.resolve(!1);for(const n of e)t=t.next(e=>e?qn.resolve(e):n());return t}static forEach(e,t){const n=[];return e.forEach((e,r)=>{n.push(t.call(this,e,r))}),this.waitFor(n)}static mapArray(e,t){return new qn((n,r)=>{const i=e.length,s=new Array(i);let o=0;for(let a=0;a<i;a++){const c=a;t(e[c]).next(e=>{s[c]=e,++o,o===i&&n(s)},e=>r(e))}})}static doWhile(e,t){return new qn((n,r)=>{const i=()=>{!0===e()?t().next(()=>{i()},r):n()};i()})}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zn="SimpleDb";class $n{static open(e,t,n,r){try{return new $n(t,e.transaction(r,n))}catch(i){throw new Wn(t,i)}}constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.S=new qt,this.transaction.oncomplete=()=>{this.S.resolve()},this.transaction.onabort=()=>{t.error?this.S.reject(new Wn(e,t.error)):this.S.resolve()},this.transaction.onerror=t=>{const n=Zn(t.target.error);this.S.reject(new Wn(e,n))}}get D(){return this.S.promise}abort(e){e&&this.S.reject(e),this.aborted||(Rt(zn,"Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}v(){const e=this.transaction;this.aborted||"function"!=typeof e.commit||e.commit()}store(e){const t=this.transaction.objectStore(e);return new Jn(t)}}class Kn{static delete(e){return Rt(zn,"Removing database:",e),Xn(o().indexedDB.deleteDatabase(e)).toPromise()}static C(){if(!E())return!1;if(Kn.F())return!0;const e=w(),t=Kn.M(e),n=0<t&&t<10,r=Gn(e),i=0<r&&r<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||n||i)}static F(){var e;return"undefined"!=typeof process&&"YES"===(null===(e=process.__PRIVATE_env)||void 0===e?void 0:e.O)}static N(e,t){return e.store(t)}static M(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(n)}constructor(e,t,n){this.name=e,this.version=t,this.B=n,this.L=null,12.2===Kn.M(w())&&Ot("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async k(e){return this.db||(Rt(zn,"Opening database:",this.name),this.db=await new Promise((t,n)=>{const r=indexedDB.open(this.name,this.version);r.onsuccess=e=>{const n=e.target.result;t(n)},r.onblocked=()=>{n(new Wn(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},r.onerror=t=>{const r=t.target.error;"VersionError"===r.name?n(new Bt(jt.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):"InvalidStateError"===r.name?n(new Bt(jt.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+r)):n(new Wn(e,r))},r.onupgradeneeded=e=>{Rt(zn,'Database "'+this.name+'" requires upgrade from version:',e.oldVersion);const t=e.target.result;if(null!==this.L&&this.L!==e.oldVersion)throw new Error(`refusing to open IndexedDB database due to potential corruption of the IndexedDB database data; this corruption could be caused by clicking the "clear site data" button in a web browser; try reloading the web page to re-initialize the IndexedDB database: lastClosedDbVersion=${this.L}, event.oldVersion=${e.oldVersion}, event.newVersion=${e.newVersion}, db.version=${t.version}`);this.B.q(t,r.transaction,e.oldVersion,this.version).next(()=>{Rt(zn,"Database upgrade to version "+this.version+" complete")})}}),this.db.addEventListener("close",e=>{const t=e.target;this.L=t.version},{passive:!0})),this.db.addEventListener("versionchange",e=>{var t;null===e.newVersion&&(Pt('Received "versionchange" event with newVersion===null; notifying the registered DatabaseDeletedListener, if any'),null===(t=this.databaseDeletedListener)||void 0===t||t.call(this))},{passive:!0}),this.db}setDatabaseDeletedListener(e){if(this.databaseDeletedListener)throw new Error("setDatabaseDeletedListener() may only be called once, and it has already been called");this.databaseDeletedListener=e}async runTransaction(e,t,n,r){const i="readonly"===t;let s=0;for(;;){++s;try{this.db=await this.k(e);const t=$n.open(this.db,e,i?"readonly":"readwrite",n),s=r(t).next(e=>(t.v(),e)).catch(e=>(t.abort(e),qn.reject(e))).toPromise();return s.catch(()=>{}),await t.D,s}catch(o){const e=o,t="FirebaseError"!==e.name&&s<3;if(Rt(zn,"Transaction failed with error:",e.message,"Retrying:",t),this.close(),!t)return Promise.reject(e)}}}close(){this.db&&this.db.close(),this.db=void 0}}function Gn(e){const t=e.match(/Android ([\d.]+)/i),n=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(n)}class Hn{constructor(e){this.$=e,this.U=!1,this.K=null}get isDone(){return this.U}get W(){return this.K}set cursor(e){this.$=e}done(){this.U=!0}G(e){this.K=e}delete(){return Xn(this.$.delete())}}class Wn extends Bt{constructor(e,t){super(jt.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function Qn(e){return"IndexedDbTransactionError"===e.name}class Jn{constructor(e){this.store=e}put(e,t){let n;return void 0!==t?(Rt(zn,"PUT",this.store.name,e,t),n=this.store.put(t,e)):(Rt(zn,"PUT",this.store.name,"<auto-key>",e),n=this.store.put(e)),Xn(n)}add(e){return Rt(zn,"ADD",this.store.name,e,e),Xn(this.store.add(e))}get(e){return Xn(this.store.get(e)).next(t=>(void 0===t&&(t=null),Rt(zn,"GET",this.store.name,e,t),t))}delete(e){return Rt(zn,"DELETE",this.store.name,e),Xn(this.store.delete(e))}count(){return Rt(zn,"COUNT",this.store.name),Xn(this.store.count())}j(e,t){const n=this.options(e,t),r=n.index?this.store.index(n.index):this.store;if("function"==typeof r.getAll){const e=r.getAll(n.range);return new qn((t,n)=>{e.onerror=e=>{n(e.target.error)},e.onsuccess=e=>{t(e.target.result)}})}{const e=this.cursor(n),t=[];return this.J(e,(e,n)=>{t.push(n)}).next(()=>t)}}H(e,t){const n=this.store.getAll(e,null===t?void 0:t);return new qn((e,t)=>{n.onerror=e=>{t(e.target.error)},n.onsuccess=t=>{e(t.target.result)}})}Y(e,t){Rt(zn,"DELETE ALL",this.store.name);const n=this.options(e,t);n.Z=!1;const r=this.cursor(n);return this.J(r,(e,t,n)=>n.delete())}X(e,t){let n;t?n=e:(n={},t=e);const r=this.cursor(n);return this.J(r,t)}ee(e){const t=this.cursor({});return new qn((n,r)=>{t.onerror=e=>{const t=Zn(e.target.error);r(t)},t.onsuccess=t=>{const r=t.target.result;r?e(r.primaryKey,r.value).next(e=>{e?r.continue():n()}):n()}})}J(e,t){const n=[];return new qn((r,i)=>{e.onerror=e=>{i(e.target.error)},e.onsuccess=e=>{const i=e.target.result;if(!i)return void r();const s=new Hn(i),o=t(i.primaryKey,i.value,s);if(o instanceof qn){const e=o.catch(e=>(s.done(),qn.reject(e)));n.push(e)}s.isDone?r():null===s.W?i.continue():i.continue(s.W)}}).next(()=>qn.waitFor(n))}options(e,t){let n;return void 0!==e&&("string"==typeof e?n=e:t=e),{index:n,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const n=this.store.index(e.index);return e.Z?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function Xn(e){return new qn((t,n)=>{e.onsuccess=e=>{const n=e.target.result;t(n)},e.onerror=e=>{const t=Zn(e.target.error);n(t)}})}let Yn=!1;function Zn(e){const t=Kn.M(w());if(t>=12.2&&t<13){const t="An internal error was encountered in the Indexed Database server";if(e.message.indexOf(t)>=0){const e=new Bt("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return Yn||(Yn=!0,setTimeout(()=>{throw e},0)),e}}return e}const er="IndexBackfiller";class tr{constructor(e,t){this.asyncQueue=e,this.te=t,this.task=null}start(){this.ne(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return null!==this.task}ne(e){Rt(er,`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,async()=>{this.task=null;try{const e=await this.te.re();Rt(er,`Documents written: ${e}`)}catch(e){Qn(e)?Rt(er,"Ignoring IndexedDB error during index backfill: ",e):await Bn(e)}await this.ne(6e4)})}}class nr{constructor(e,t){this.localStore=e,this.persistence=t}async re(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",t=>this.ie(t,e))}ie(e,t){const n=new Set;let r=t,i=!0;return qn.doWhile(()=>!0===i&&r>0,()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next(t=>{if(null!==t&&!n.has(t))return Rt(er,`Processing collection: ${t}`),this.se(e,t,r).next(e=>{r-=e,n.add(t)});i=!1})).next(()=>t-r)}se(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next(r=>this.localStore.localDocuments.getNextDocuments(e,t,r,n).next(n=>{const i=n.changes;return this.localStore.indexManager.updateIndexEntries(e,i).next(()=>this.oe(r,n)).next(n=>(Rt(er,`Updating offset: ${n}`),this.localStore.indexManager.updateCollectionGroup(e,t,n))).next(()=>i.size)}))}oe(e,t){let n=e;return t.changes.forEach((e,t)=>{const r=Mn(t);Vn(r,n)>0&&(n=r)}),new Fn(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rr{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=e=>this._e(e),this.ae=e=>t.writeSequenceNumber(e))}_e(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ae&&this.ae(e),e}}rr.ue=-1;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ir=-1;function sr(e){return null==e}function or(e){return 0===e&&1/e==-1/0}function ar(e){return"number"==typeof e&&Number.isInteger(e)&&!or(e)&&e<=Number.MAX_SAFE_INTEGER&&e>=Number.MIN_SAFE_INTEGER}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cr="";function ur(e){let t="";for(let n=0;n<e.length;n++)t.length>0&&(t=hr(t)),t=lr(e.get(n),t);return hr(t)}function lr(e,t){let n=t;const r=e.length;for(let i=0;i<r;i++){const t=e.charAt(i);switch(t){case"\0":n+="";break;case cr:n+="";break;default:n+=t}}return n}function hr(e){return e+cr+""}function dr(e){const t=e.length;if(Vt(t>=2,64408,{path:e}),2===t)return Vt(e.charAt(0)===cr&&""===e.charAt(1),56145,{path:e}),un.emptyPath();const n=t-2,r=[];let i="";for(let s=0;s<t;){const t=e.indexOf(cr,s);switch((t<0||t>n)&&Mt(50515,{path:e}),e.charAt(t+1)){case"":const n=e.substring(s,t);let o;0===i.length?o=n:(i+=n,o=i,i=""),r.push(o);break;case"":i+=e.substring(s,t),i+="\0";break;case"":i+=e.substring(s,t+1);break;default:Mt(61167,{path:e})}s=t+2}return new un(r)}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fr="remoteDocuments",pr="owner",mr="owner",gr="mutationQueues",yr="mutations",vr="batchId",wr="userMutationsIndex",br=["userId","batchId"];
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ir(e,t){return[e,ur(t)]}function _r(e,t,n){return[e,ur(t),n]}const Tr={},Er="documentMutations",Sr="remoteDocumentsV14",Cr=["prefixPath","collectionGroup","readTime","documentId"],Ar="documentKeyIndex",kr=["prefixPath","collectionGroup","documentId"],Nr="collectionGroupIndex",Dr=["collectionGroup","readTime","prefixPath","documentId"],xr="remoteDocumentGlobal",Rr="remoteDocumentGlobalKey",Or="targets",Pr="queryTargetsIndex",Lr=["canonicalId","targetId"],Mr="targetDocuments",Fr=["targetId","path"],Vr="documentTargetsIndex",Ur=["path","targetId"],jr="targetGlobalKey",Br="targetGlobal",qr="collectionParents",zr=["collectionId","parent"],$r="clientMetadata",Kr="bundles",Gr="namedQueries",Hr="indexConfiguration",Wr="collectionGroupIndex",Qr="indexState",Jr=["indexId","uid"],Xr="sequenceNumberIndex",Yr=["uid","sequenceNumber"],Zr="indexEntries",ei=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],ti="documentKeyIndex",ni=["indexId","uid","orderedDocumentKey"],ri="documentOverlays",ii=["userId","collectionPath","documentId"],si="collectionPathOverlayIndex",oi=["userId","collectionPath","largestBatchId"],ai="collectionGroupOverlayIndex",ci=["userId","collectionGroup","largestBatchId"],ui="globals",li=[gr,yr,Er,fr,Or,pr,Br,Mr,$r,xr,qr,Kr,Gr],hi=[...li,ri],di=[gr,yr,Er,Sr,Or,pr,Br,Mr,$r,xr,qr,Kr,Gr,ri],fi=di,pi=[...fi,Hr,Qr,Zr],mi=pi,gi=[...pi,ui],yi=gi;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vi extends jn{constructor(e,t){super(),this.ce=e,this.currentSequenceNumber=t}}function wi(e,t){const n=Ut(e);return Kn.N(n.ce,t)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bi(e){let t=0;for(const n in e)Object.prototype.hasOwnProperty.call(e,n)&&t++;return t}function Ii(e,t){for(const n in e)Object.prototype.hasOwnProperty.call(e,n)&&t(n,e[n])}function _i(e,t){const n=[];for(const r in e)Object.prototype.hasOwnProperty.call(e,r)&&n.push(t(e[r],r,e));return n}function Ti(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ei{constructor(e,t){this.comparator=e,this.root=t||Ci.EMPTY}insert(e,t){return new Ei(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Ci.BLACK,null,null))}remove(e){return new Ei(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Ci.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(0===n)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(0===r)return t+n.left.size;r<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,n)=>(e(t,n),!1))}toString(){const e=[];return this.inorderTraversal((t,n)=>(e.push(`${t}:${n}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Si(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Si(this.root,e,this.comparator,!1)}getReverseIterator(){return new Si(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Si(this.root,e,this.comparator,!0)}}class Si{constructor(e,t,n,r){this.isReverse=r,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&r&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(0===i){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(0===this.nodeStack.length)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Ci{constructor(e,t,n,r,i){this.key=e,this.value=t,this.color=null!=n?n:Ci.RED,this.left=null!=r?r:Ci.EMPTY,this.right=null!=i?i:Ci.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,r,i){return new Ci(null!=e?e:this.key,null!=t?t:this.value,null!=n?n:this.color,null!=r?r:this.left,null!=i?i:this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let r=this;const i=n(e,r.key);return r=i<0?r.copy(null,null,null,r.left.insert(e,t,n),null):0===i?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,n)),r.fixUp()}removeMin(){if(this.left.isEmpty())return Ci.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,r=this;if(t(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,t),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),0===t(e,r.key)){if(r.right.isEmpty())return Ci.EMPTY;n=r.right.min(),r=r.copy(n.key,n.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,t))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Ci.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Ci.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw Mt(43730,{key:this.key,value:this.value});if(this.right.isRed())throw Mt(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw Mt(27949);return e+(this.isRed()?0:1)}}Ci.EMPTY=null,Ci.RED=!0,Ci.BLACK=!1,Ci.EMPTY=new class{constructor(){this.size=0}get key(){throw Mt(57766)}get value(){throw Mt(16141)}get color(){throw Mt(16727)}get left(){throw Mt(29726)}get right(){throw Mt(36894)}copy(e,t,n,r,i){return this}insert(e,t,n){return new Ci(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ai{constructor(e){this.comparator=e,this.data=new Ei(this.comparator)}has(e){return null!==this.data.get(e)}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,n)=>(e(t),!1))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const r=n.getNext();if(this.comparator(r.key,e[1])>=0)return;t(r.key)}}forEachWhile(e,t){let n;for(n=void 0!==t?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new ki(this.data.getIterator())}getIteratorFrom(e){return new ki(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(e=>{t=t.add(e)}),t}isEqual(e){if(!(e instanceof Ai))return!1;if(this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const e=t.getNext().key,r=n.getNext().key;if(0!==this.comparator(e,r))return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new Ai(this.comparator);return t.data=e,t}}class ki{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function Ni(e){return e.hasNext()?e.getNext():void 0}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Di{constructor(e){this.fields=e,e.sort(hn.comparator)}static empty(){return new Di([])}unionWith(e){let t=new Ai(hn.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new Di(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return sn(this.fields,e.fields,(e,t)=>e.isEqual(t))}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xi extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ri{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(e){try{return atob(e)}catch(t){throw"undefined"!=typeof DOMException&&t instanceof DOMException?new xi("Invalid base64 string: "+t):t}}(e);return new Ri(t)}static fromUint8Array(e){const t=function(e){let t="";for(let n=0;n<e.length;++n)t+=String.fromCharCode(e[n]);return t}(e);return new Ri(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return e=this.binaryString,btoa(e);var e}toUint8Array(){return function(e){const t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return en(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Ri.EMPTY_BYTE_STRING=new Ri("");const Oi=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Pi(e){if(Vt(!!e,39018),"string"==typeof e){let t=0;const n=Oi.exec(e);if(Vt(!!n,46558,{timestamp:e}),n[1]){let e=n[1];e=(e+"000000000").substr(0,9),t=Number(e)}const r=new Date(e);return{seconds:Math.floor(r.getTime()/1e3),nanos:t}}return{seconds:Li(e.seconds),nanos:Li(e.nanos)}}function Li(e){return"number"==typeof e?e:"string"==typeof e?Number(e):0}function Mi(e){return"string"==typeof e?Ri.fromBase64String(e):Ri.fromUint8Array(e)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fi="server_timestamp",Vi="__type__",Ui="__previous_value__",ji="__local_write_time__";function Bi(e){var t,n;return(null===(n=((null===(t=null==e?void 0:e.mapValue)||void 0===t?void 0:t.fields)||{})[Vi])||void 0===n?void 0:n.stringValue)===Fi}function qi(e){const t=e.mapValue.fields[Ui];return Bi(t)?qi(t):t}function zi(e){const t=Pi(e.mapValue.fields[ji].timestampValue);return new Sn(t.seconds,t.nanos)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $i{constructor(e,t,n,r,i,s,o,a,c,u){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=r,this.ssl=i,this.forceLongPolling=s,this.autoDetectLongPolling=o,this.longPollingOptions=a,this.useFetchStreams=c,this.isUsingEmulator=u}}const Ki="(default)";class Gi{constructor(e,t){this.projectId=e,this.database=t||Ki}static empty(){return new Gi("","")}get isDefaultDatabase(){return this.database===Ki}isEqual(e){return e instanceof Gi&&e.projectId===this.projectId&&e.database===this.database}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hi="__type__",Wi="__max__",Qi={mapValue:{fields:{__type__:{stringValue:Wi}}}},Ji="__vector__",Xi="value",Yi={nullValue:"NULL_VALUE"};function Zi(e){return"nullValue"in e?0:"booleanValue"in e?1:"integerValue"in e||"doubleValue"in e?2:"timestampValue"in e?3:"stringValue"in e?5:"bytesValue"in e?6:"referenceValue"in e?7:"geoPointValue"in e?8:"arrayValue"in e?9:"mapValue"in e?Bi(e)?4:gs(e)?9007199254740991:ps(e)?10:11:Mt(28295,{value:e})}function es(e,t){if(e===t)return!0;const n=Zi(e);if(n!==Zi(t))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return e.booleanValue===t.booleanValue;case 4:return zi(e).isEqual(zi(t));case 3:return function(e,t){if("string"==typeof e.timestampValue&&"string"==typeof t.timestampValue&&e.timestampValue.length===t.timestampValue.length)return e.timestampValue===t.timestampValue;const n=Pi(e.timestampValue),r=Pi(t.timestampValue);return n.seconds===r.seconds&&n.nanos===r.nanos}(e,t);case 5:return e.stringValue===t.stringValue;case 6:return r=t,Mi(e.bytesValue).isEqual(Mi(r.bytesValue));case 7:return e.referenceValue===t.referenceValue;case 8:return function(e,t){return Li(e.geoPointValue.latitude)===Li(t.geoPointValue.latitude)&&Li(e.geoPointValue.longitude)===Li(t.geoPointValue.longitude)}(e,t);case 2:return function(e,t){if("integerValue"in e&&"integerValue"in t)return Li(e.integerValue)===Li(t.integerValue);if("doubleValue"in e&&"doubleValue"in t){const n=Li(e.doubleValue),r=Li(t.doubleValue);return n===r?or(n)===or(r):isNaN(n)&&isNaN(r)}return!1}(e,t);case 9:return sn(e.arrayValue.values||[],t.arrayValue.values||[],es);case 10:case 11:return function(e,t){const n=e.mapValue.fields||{},r=t.mapValue.fields||{};if(bi(n)!==bi(r))return!1;for(const i in n)if(n.hasOwnProperty(i)&&(void 0===r[i]||!es(n[i],r[i])))return!1;return!0}(e,t);default:return Mt(52216,{left:e})}var r}function ts(e,t){return void 0!==(e.values||[]).find(e=>es(e,t))}function ns(e,t){if(e===t)return 0;const n=Zi(e),r=Zi(t);if(n!==r)return en(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return en(e.booleanValue,t.booleanValue);case 2:return function(e,t){const n=Li(e.integerValue||e.doubleValue),r=Li(t.integerValue||t.doubleValue);return n<r?-1:n>r?1:n===r?0:isNaN(n)?isNaN(r)?0:-1:1}(e,t);case 3:return rs(e.timestampValue,t.timestampValue);case 4:return rs(zi(e),zi(t));case 5:return tn(e.stringValue,t.stringValue);case 6:return function(e,t){const n=Mi(e),r=Mi(t);return n.compareTo(r)}(e.bytesValue,t.bytesValue);case 7:return function(e,t){const n=e.split("/"),r=t.split("/");for(let i=0;i<n.length&&i<r.length;i++){const e=en(n[i],r[i]);if(0!==e)return e}return en(n.length,r.length)}(e.referenceValue,t.referenceValue);case 8:return function(e,t){const n=en(Li(e.latitude),Li(t.latitude));return 0!==n?n:en(Li(e.longitude),Li(t.longitude))}(e.geoPointValue,t.geoPointValue);case 9:return is(e.arrayValue,t.arrayValue);case 10:return function(e,t){var n,r,i,s;const o=e.fields||{},a=t.fields||{},c=null===(n=o[Xi])||void 0===n?void 0:n.arrayValue,u=null===(r=a[Xi])||void 0===r?void 0:r.arrayValue,l=en((null===(i=null==c?void 0:c.values)||void 0===i?void 0:i.length)||0,(null===(s=null==u?void 0:u.values)||void 0===s?void 0:s.length)||0);return 0!==l?l:is(c,u)}(e.mapValue,t.mapValue);case 11:return function(e,t){if(e===Qi.mapValue&&t===Qi.mapValue)return 0;if(e===Qi.mapValue)return 1;if(t===Qi.mapValue)return-1;const n=e.fields||{},r=Object.keys(n),i=t.fields||{},s=Object.keys(i);r.sort(),s.sort();for(let o=0;o<r.length&&o<s.length;++o){const e=tn(r[o],s[o]);if(0!==e)return e;const t=ns(n[r[o]],i[s[o]]);if(0!==t)return t}return en(r.length,s.length)}(e.mapValue,t.mapValue);default:throw Mt(23264,{le:n})}}function rs(e,t){if("string"==typeof e&&"string"==typeof t&&e.length===t.length)return en(e,t);const n=Pi(e),r=Pi(t),i=en(n.seconds,r.seconds);return 0!==i?i:en(n.nanos,r.nanos)}function is(e,t){const n=e.values||[],r=t.values||[];for(let i=0;i<n.length&&i<r.length;++i){const e=ns(n[i],r[i]);if(e)return e}return en(n.length,r.length)}function ss(e){return os(e)}function os(e){return"nullValue"in e?"null":"booleanValue"in e?""+e.booleanValue:"integerValue"in e?""+e.integerValue:"doubleValue"in e?""+e.doubleValue:"timestampValue"in e?function(e){const t=Pi(e);return`time(${t.seconds},${t.nanos})`}(e.timestampValue):"stringValue"in e?e.stringValue:"bytesValue"in e?Mi(e.bytesValue).toBase64():"referenceValue"in e?function(e){return dn.fromName(e).toString()}(e.referenceValue):"geoPointValue"in e?function(e){return`geo(${e.latitude},${e.longitude})`}(e.geoPointValue):"arrayValue"in e?function(e){let t="[",n=!0;for(const r of e.values||[])n?n=!1:t+=",",t+=os(r);return t+"]"}(e.arrayValue):"mapValue"in e?function(e){const t=Object.keys(e.fields||{}).sort();let n="{",r=!0;for(const i of t)r?r=!1:n+=",",n+=`${i}:${os(e.fields[i])}`;return n+"}"}(e.mapValue):Mt(61005,{value:e})}function as(e){switch(Zi(e)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const t=qi(e);return t?16+as(t):16;case 5:return 2*e.stringValue.length;case 6:return Mi(e.bytesValue).approximateByteSize();case 7:return e.referenceValue.length;case 9:return(e.arrayValue.values||[]).reduce((e,t)=>e+as(t),0);case 10:case 11:return function(e){let t=0;return Ii(e.fields,(e,n)=>{t+=e.length+as(n)}),t}(e.mapValue);default:throw Mt(13486,{value:e})}}function cs(e,t){return{referenceValue:`projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`}}function us(e){return!!e&&"integerValue"in e}function ls(e){return!!e&&"arrayValue"in e}function hs(e){return!!e&&"nullValue"in e}function ds(e){return!!e&&"doubleValue"in e&&isNaN(Number(e.doubleValue))}function fs(e){return!!e&&"mapValue"in e}function ps(e){var t,n;return(null===(n=((null===(t=null==e?void 0:e.mapValue)||void 0===t?void 0:t.fields)||{})[Hi])||void 0===n?void 0:n.stringValue)===Ji}function ms(e){if(e.geoPointValue)return{geoPointValue:Object.assign({},e.geoPointValue)};if(e.timestampValue&&"object"==typeof e.timestampValue)return{timestampValue:Object.assign({},e.timestampValue)};if(e.mapValue){const t={mapValue:{fields:{}}};return Ii(e.mapValue.fields,(e,n)=>t.mapValue.fields[e]=ms(n)),t}if(e.arrayValue){const t={arrayValue:{values:[]}};for(let n=0;n<(e.arrayValue.values||[]).length;++n)t.arrayValue.values[n]=ms(e.arrayValue.values[n]);return t}return Object.assign({},e)}function gs(e){return(((e.mapValue||{}).fields||{}).__type__||{}).stringValue===Wi}const ys={mapValue:{fields:{[Hi]:{stringValue:Ji},[Xi]:{arrayValue:{}}}}};function vs(e){return"nullValue"in e?Yi:"booleanValue"in e?{booleanValue:!1}:"integerValue"in e||"doubleValue"in e?{doubleValue:NaN}:"timestampValue"in e?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in e?{stringValue:""}:"bytesValue"in e?{bytesValue:""}:"referenceValue"in e?cs(Gi.empty(),dn.empty()):"geoPointValue"in e?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in e?{arrayValue:{}}:"mapValue"in e?ps(e)?ys:{mapValue:{}}:Mt(35942,{value:e})}function ws(e){return"nullValue"in e?{booleanValue:!1}:"booleanValue"in e?{doubleValue:NaN}:"integerValue"in e||"doubleValue"in e?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in e?{stringValue:""}:"stringValue"in e?{bytesValue:""}:"bytesValue"in e?cs(Gi.empty(),dn.empty()):"referenceValue"in e?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in e?{arrayValue:{}}:"arrayValue"in e?ys:"mapValue"in e?ps(e)?{mapValue:{}}:Qi:Mt(61959,{value:e})}function bs(e,t){const n=ns(e.value,t.value);return 0!==n?n:e.inclusive&&!t.inclusive?-1:!e.inclusive&&t.inclusive?1:0}function Is(e,t){const n=ns(e.value,t.value);return 0!==n?n:e.inclusive&&!t.inclusive?1:!e.inclusive&&t.inclusive?-1:0}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _s{constructor(e){this.value=e}static empty(){return new _s({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!fs(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=ms(t)}setAll(e){let t=hn.emptyPath(),n={},r=[];e.forEach((e,i)=>{if(!t.isImmediateParentOf(i)){const e=this.getFieldsMap(t);this.applyChanges(e,n,r),n={},r=[],t=i.popLast()}e?n[i.lastSegment()]=ms(e):r.push(i.lastSegment())});const i=this.getFieldsMap(t);this.applyChanges(i,n,r)}delete(e){const t=this.field(e.popLast());fs(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return es(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let r=t.mapValue.fields[e.get(n)];fs(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=r),t=r}return t.mapValue.fields}applyChanges(e,t,n){Ii(t,(t,n)=>e[t]=n);for(const r of n)delete e[r]}clone(){return new _s(ms(this.value))}}function Ts(e){const t=[];return Ii(e.fields,(e,n)=>{const r=new hn([e]);if(fs(n)){const e=Ts(n.mapValue).fields;if(0===e.length)t.push(r);else for(const n of e)t.push(r.child(n))}else t.push(r)}),new Di(t)
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class Es{constructor(e,t,n,r,i,s,o){this.key=e,this.documentType=t,this.version=n,this.readTime=r,this.createTime=i,this.data=s,this.documentState=o}static newInvalidDocument(e){return new Es(e,0,Cn.min(),Cn.min(),Cn.min(),_s.empty(),0)}static newFoundDocument(e,t,n,r){return new Es(e,1,t,Cn.min(),n,r,0)}static newNoDocument(e,t){return new Es(e,2,t,Cn.min(),Cn.min(),_s.empty(),0)}static newUnknownDocument(e,t){return new Es(e,3,t,Cn.min(),Cn.min(),_s.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(Cn.min())||2!==this.documentType&&0!==this.documentType||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=_s.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=_s.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Cn.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return 1===this.documentState}get hasCommittedMutations(){return 2===this.documentState}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return 0!==this.documentType}isFoundDocument(){return 1===this.documentType}isNoDocument(){return 2===this.documentType}isUnknownDocument(){return 3===this.documentType}isEqual(e){return e instanceof Es&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Es(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ss{constructor(e,t){this.position=e,this.inclusive=t}}function Cs(e,t,n){let r=0;for(let i=0;i<e.position.length;i++){const s=t[i],o=e.position[i];if(r=s.field.isKeyField()?dn.comparator(dn.fromName(o.referenceValue),n.key):ns(o,n.data.field(s.field)),"desc"===s.dir&&(r*=-1),0!==r)break}return r}function As(e,t){if(null===e)return null===t;if(null===t)return!1;if(e.inclusive!==t.inclusive||e.position.length!==t.position.length)return!1;for(let n=0;n<e.position.length;n++)if(!es(e.position[n],t.position[n]))return!1;return!0}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ks{constructor(e,t="asc"){this.field=e,this.dir=t}}function Ns(e,t){return e.dir===t.dir&&e.field.isEqual(t.field)}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ds{}class xs extends Ds{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?"in"===t||"not-in"===t?this.createKeyFieldInFilter(e,t,n):new Bs(e,t,n):"array-contains"===t?new Ks(e,n):"in"===t?new Gs(e,n):"not-in"===t?new Hs(e,n):"array-contains-any"===t?new Ws(e,n):new xs(e,t,n)}static createKeyFieldInFilter(e,t,n){return"in"===t?new qs(e,n):new zs(e,n)}matches(e){const t=e.data.field(this.field);return"!="===this.op?null!==t&&void 0===t.nullValue&&this.matchesComparison(ns(t,this.value)):null!==t&&Zi(this.value)===Zi(t)&&this.matchesComparison(ns(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return 0===e;case"!=":return 0!==e;case">":return e>0;case">=":return e>=0;default:return Mt(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Rs extends Ds{constructor(e,t){super(),this.filters=e,this.op=t,this.he=null}static create(e,t){return new Rs(e,t)}matches(e){return Os(this)?void 0===this.filters.find(t=>!t.matches(e)):void 0!==this.filters.find(t=>t.matches(e))}getFlattenedFilters(){return null!==this.he||(this.he=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.he}getFilters(){return Object.assign([],this.filters)}}function Os(e){return"and"===e.op}function Ps(e){return"or"===e.op}function Ls(e){return Ms(e)&&Os(e)}function Ms(e){for(const t of e.filters)if(t instanceof Rs)return!1;return!0}function Fs(e){if(e instanceof xs)return e.field.canonicalString()+e.op.toString()+ss(e.value);if(Ls(e))return e.filters.map(e=>Fs(e)).join(",");{const t=e.filters.map(e=>Fs(e)).join(",");return`${e.op}(${t})`}}function Vs(e,t){return e instanceof xs?(n=e,(r=t)instanceof xs&&n.op===r.op&&n.field.isEqual(r.field)&&es(n.value,r.value)):e instanceof Rs?function(e,t){return t instanceof Rs&&e.op===t.op&&e.filters.length===t.filters.length&&e.filters.reduce((e,n,r)=>e&&Vs(n,t.filters[r]),!0)}(e,t):void Mt(19439);var n,r}function Us(e,t){const n=e.filters.concat(t);return Rs.create(n,e.op)}function js(e){return e instanceof xs?`${(t=e).field.canonicalString()} ${t.op} ${ss(t.value)}`:e instanceof Rs?function(e){return e.op.toString()+" {"+e.getFilters().map(js).join(" ,")+"}"}(e):"Filter";var t}class Bs extends xs{constructor(e,t,n){super(e,t,n),this.key=dn.fromName(n.referenceValue)}matches(e){const t=dn.comparator(e.key,this.key);return this.matchesComparison(t)}}class qs extends xs{constructor(e,t){super(e,"in",t),this.keys=$s("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class zs extends xs{constructor(e,t){super(e,"not-in",t),this.keys=$s("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function $s(e,t){var n;return((null===(n=t.arrayValue)||void 0===n?void 0:n.values)||[]).map(e=>dn.fromName(e.referenceValue))}class Ks extends xs{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return ls(t)&&ts(t.arrayValue,this.value)}}class Gs extends xs{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return null!==t&&ts(this.value.arrayValue,t)}}class Hs extends xs{constructor(e,t){super(e,"not-in",t)}matches(e){if(ts(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return null!==t&&void 0===t.nullValue&&!ts(this.value.arrayValue,t)}}class Ws extends xs{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!ls(t)||!t.arrayValue.values)&&t.arrayValue.values.some(e=>ts(this.value.arrayValue,e))}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qs{constructor(e,t=null,n=[],r=[],i=null,s=null,o=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=r,this.limit=i,this.startAt=s,this.endAt=o,this.Pe=null}}function Js(e,t=null,n=[],r=[],i=null,s=null,o=null){return new Qs(e,t,n,r,i,s,o)}function Xs(e){const t=Ut(e);if(null===t.Pe){let e=t.path.canonicalString();null!==t.collectionGroup&&(e+="|cg:"+t.collectionGroup),e+="|f:",e+=t.filters.map(e=>Fs(e)).join(","),e+="|ob:",e+=t.orderBy.map(e=>{return(t=e).field.canonicalString()+t.dir;var t}).join(","),sr(t.limit)||(e+="|l:",e+=t.limit),t.startAt&&(e+="|lb:",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map(e=>ss(e)).join(",")),t.endAt&&(e+="|ub:",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map(e=>ss(e)).join(",")),t.Pe=e}return t.Pe}function Ys(e,t){if(e.limit!==t.limit)return!1;if(e.orderBy.length!==t.orderBy.length)return!1;for(let n=0;n<e.orderBy.length;n++)if(!Ns(e.orderBy[n],t.orderBy[n]))return!1;if(e.filters.length!==t.filters.length)return!1;for(let n=0;n<e.filters.length;n++)if(!Vs(e.filters[n],t.filters[n]))return!1;return e.collectionGroup===t.collectionGroup&&!!e.path.isEqual(t.path)&&!!As(e.startAt,t.startAt)&&As(e.endAt,t.endAt)}function Zs(e){return dn.isDocumentKey(e.path)&&null===e.collectionGroup&&0===e.filters.length}function eo(e,t){return e.filters.filter(e=>e instanceof xs&&e.field.isEqual(t))}function to(e,t,n){let r=Yi,i=!0;for(const s of eo(e,t)){let e=Yi,t=!0;switch(s.op){case"<":case"<=":e=vs(s.value);break;case"==":case"in":case">=":e=s.value;break;case">":e=s.value,t=!1;break;case"!=":case"not-in":e=Yi}bs({value:r,inclusive:i},{value:e,inclusive:t})<0&&(r=e,i=t)}if(null!==n)for(let s=0;s<e.orderBy.length;++s)if(e.orderBy[s].field.isEqual(t)){const e=n.position[s];bs({value:r,inclusive:i},{value:e,inclusive:n.inclusive})<0&&(r=e,i=n.inclusive);break}return{value:r,inclusive:i}}function no(e,t,n){let r=Qi,i=!0;for(const s of eo(e,t)){let e=Qi,t=!0;switch(s.op){case">=":case">":e=ws(s.value),t=!1;break;case"==":case"in":case"<=":e=s.value;break;case"<":e=s.value,t=!1;break;case"!=":case"not-in":e=Qi}Is({value:r,inclusive:i},{value:e,inclusive:t})>0&&(r=e,i=t)}if(null!==n)for(let s=0;s<e.orderBy.length;++s)if(e.orderBy[s].field.isEqual(t)){const e=n.position[s];Is({value:r,inclusive:i},{value:e,inclusive:n.inclusive})>0&&(r=e,i=n.inclusive);break}return{value:r,inclusive:i}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ro{constructor(e,t=null,n=[],r=[],i=null,s="F",o=null,a=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=r,this.limit=i,this.limitType=s,this.startAt=o,this.endAt=a,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function io(e,t,n,r,i,s,o,a){return new ro(e,t,n,r,i,s,o,a)}function so(e){return new ro(e)}function oo(e){return 0===e.filters.length&&null===e.limit&&null==e.startAt&&null==e.endAt&&(0===e.explicitOrderBy.length||1===e.explicitOrderBy.length&&e.explicitOrderBy[0].field.isKeyField())}function ao(e){return null!==e.collectionGroup}function co(e){const t=Ut(e);if(null===t.Te){t.Te=[];const e=new Set;for(const r of t.explicitOrderBy)t.Te.push(r),e.add(r.field.canonicalString());const n=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(e){let t=new Ai(hn.comparator);return e.filters.forEach(e=>{e.getFlattenedFilters().forEach(e=>{e.isInequality()&&(t=t.add(e.field))})}),t})(t).forEach(r=>{e.has(r.canonicalString())||r.isKeyField()||t.Te.push(new ks(r,n))}),e.has(hn.keyField().canonicalString())||t.Te.push(new ks(hn.keyField(),n))}return t.Te}function uo(e){const t=Ut(e);return t.Ie||(t.Ie=ho(t,co(e))),t.Ie}function lo(e){const t=Ut(e);return t.de||(t.de=ho(t,e.explicitOrderBy)),t.de}function ho(e,t){if("F"===e.limitType)return Js(e.path,e.collectionGroup,t,e.filters,e.limit,e.startAt,e.endAt);{t=t.map(e=>{const t="desc"===e.dir?"asc":"desc";return new ks(e.field,t)});const n=e.endAt?new Ss(e.endAt.position,e.endAt.inclusive):null,r=e.startAt?new Ss(e.startAt.position,e.startAt.inclusive):null;return Js(e.path,e.collectionGroup,t,e.filters,e.limit,n,r)}}function fo(e,t){const n=e.filters.concat([t]);return new ro(e.path,e.collectionGroup,e.explicitOrderBy.slice(),n,e.limit,e.limitType,e.startAt,e.endAt)}function po(e,t,n){return new ro(e.path,e.collectionGroup,e.explicitOrderBy.slice(),e.filters.slice(),t,n,e.startAt,e.endAt)}function mo(e,t){return Ys(uo(e),uo(t))&&e.limitType===t.limitType}function go(e){return`${Xs(uo(e))}|lt:${e.limitType}`}function yo(e){return`Query(target=${function(e){let t=e.path.canonicalString();return null!==e.collectionGroup&&(t+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(t+=`, filters: [${e.filters.map(e=>js(e)).join(", ")}]`),sr(e.limit)||(t+=", limit: "+e.limit),e.orderBy.length>0&&(t+=`, orderBy: [${e.orderBy.map(e=>{return`${(t=e).field.canonicalString()} (${t.dir})`;var t}).join(", ")}]`),e.startAt&&(t+=", startAt: ",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(e=>ss(e)).join(",")),e.endAt&&(t+=", endAt: ",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(e=>ss(e)).join(",")),`Target(${t})`}(uo(e))}; limitType=${e.limitType})`}function vo(e,t){return t.isFoundDocument()&&function(e,t){const n=t.key.path;return null!==e.collectionGroup?t.key.hasCollectionId(e.collectionGroup)&&e.path.isPrefixOf(n):dn.isDocumentKey(e.path)?e.path.isEqual(n):e.path.isImmediateParentOf(n)}(e,t)&&function(e,t){for(const n of co(e))if(!n.field.isKeyField()&&null===t.data.field(n.field))return!1;return!0}(e,t)&&function(e,t){for(const n of e.filters)if(!n.matches(t))return!1;return!0}(e,t)&&(r=t,!((n=e).startAt&&!function(e,t,n){const r=Cs(e,t,n);return e.inclusive?r<=0:r<0}(n.startAt,co(n),r)||n.endAt&&!function(e,t,n){const r=Cs(e,t,n);return e.inclusive?r>=0:r>0}(n.endAt,co(n),r)));var n,r}function wo(e){return e.collectionGroup||(e.path.length%2==1?e.path.lastSegment():e.path.get(e.path.length-2))}function bo(e){return(t,n)=>{let r=!1;for(const i of co(e)){const e=Io(i,t,n);if(0!==e)return e;r=r||i.field.isKeyField()}return 0}}function Io(e,t,n){const r=e.field.isKeyField()?dn.comparator(t.key,n.key):function(e,t,n){const r=t.data.field(e),i=n.data.field(e);return null!==r&&null!==i?ns(r,i):Mt(42886)}(e.field,t,n);switch(e.dir){case"asc":return r;case"desc":return-1*r;default:return Mt(19790,{direction:e.dir})}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _o{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(void 0!==n)for(const[r,i]of n)if(this.equalsFn(r,e))return i}has(e){return void 0!==this.get(e)}set(e,t){const n=this.mapKeyFn(e),r=this.inner[n];if(void 0===r)return this.inner[n]=[[e,t]],void this.innerSize++;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return void(r[i]=[e,t]);r.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(void 0===n)return!1;for(let r=0;r<n.length;r++)if(this.equalsFn(n[r][0],e))return 1===n.length?delete this.inner[t]:n.splice(r,1),this.innerSize--,!0;return!1}forEach(e){Ii(this.inner,(t,n)=>{for(const[r,i]of n)e(r,i)})}isEmpty(){return Ti(this.inner)}size(){return this.innerSize}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const To=new Ei(dn.comparator);function Eo(){return To}const So=new Ei(dn.comparator);function Co(...e){let t=So;for(const n of e)t=t.insert(n.key,n);return t}function Ao(e){let t=So;return e.forEach((e,n)=>t=t.insert(e,n.overlayedDocument)),t}function ko(){return Do()}function No(){return Do()}function Do(){return new _o(e=>e.toString(),(e,t)=>e.isEqual(t))}const xo=new Ei(dn.comparator),Ro=new Ai(dn.comparator);function Oo(...e){let t=Ro;for(const n of e)t=t.add(n);return t}const Po=new Ai(en);function Lo(){return Po}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mo(e,t){if(e.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:or(t)?"-0":t}}function Fo(e){return{integerValue:""+e}}function Vo(e,t){return ar(t)?Fo(t):Mo(e,t)}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uo{constructor(){this._=void 0}}function jo(e,t,n){return e instanceof zo?function(e,t){const n={fields:{[Vi]:{stringValue:Fi},[ji]:{timestampValue:{seconds:e.seconds,nanos:e.nanoseconds}}}};return t&&Bi(t)&&(t=qi(t)),t&&(n.fields[Ui]=t),{mapValue:n}}(n,t):e instanceof $o?Ko(e,t):e instanceof Go?Ho(e,t):function(e,t){const n=qo(e,t),r=Qo(n)+Qo(e.Ee);return us(n)&&us(e.Ee)?Fo(r):Mo(e.serializer,r)}(e,t)}function Bo(e,t,n){return e instanceof $o?Ko(e,t):e instanceof Go?Ho(e,t):n}function qo(e,t){return e instanceof Wo?us(n=t)||(r=n)&&"doubleValue"in r?t:{integerValue:0}:null;var n,r}class zo extends Uo{}class $o extends Uo{constructor(e){super(),this.elements=e}}function Ko(e,t){const n=Jo(t);for(const r of e.elements)n.some(e=>es(e,r))||n.push(r);return{arrayValue:{values:n}}}class Go extends Uo{constructor(e){super(),this.elements=e}}function Ho(e,t){let n=Jo(t);for(const r of e.elements)n=n.filter(e=>!es(e,r));return{arrayValue:{values:n}}}class Wo extends Uo{constructor(e,t){super(),this.serializer=e,this.Ee=t}}function Qo(e){return Li(e.integerValue||e.doubleValue)}function Jo(e){return ls(e)&&e.arrayValue.values?e.arrayValue.values.slice():[]}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xo{constructor(e,t){this.field=e,this.transform=t}}class Yo{constructor(e,t){this.version=e,this.transformResults=t}}class Zo{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Zo}static exists(e){return new Zo(void 0,e)}static updateTime(e){return new Zo(e)}get isNone(){return void 0===this.updateTime&&void 0===this.exists}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function ea(e,t){return void 0!==e.updateTime?t.isFoundDocument()&&t.version.isEqual(e.updateTime):void 0===e.exists||e.exists===t.isFoundDocument()}class ta{}function na(e,t){if(!e.hasLocalMutations||t&&0===t.fields.length)return null;if(null===t)return e.isNoDocument()?new da(e.key,Zo.none()):new aa(e.key,e.data,Zo.none());{const n=e.data,r=_s.empty();let i=new Ai(hn.comparator);for(let e of t.fields)if(!i.has(e)){let t=n.field(e);null===t&&e.length>1&&(e=e.popLast(),t=n.field(e)),null===t?r.delete(e):r.set(e,t),i=i.add(e)}return new ca(e.key,r,new Di(i.toArray()),Zo.none())}}function ra(e,t,n){var r;e instanceof aa?function(e,t,n){const r=e.value.clone(),i=la(e.fieldTransforms,t,n.transformResults);r.setAll(i),t.convertToFoundDocument(n.version,r).setHasCommittedMutations()}(e,t,n):e instanceof ca?function(e,t,n){if(!ea(e.precondition,t))return void t.convertToUnknownDocument(n.version);const r=la(e.fieldTransforms,t,n.transformResults),i=t.data;i.setAll(ua(e)),i.setAll(r),t.convertToFoundDocument(n.version,i).setHasCommittedMutations()}(e,t,n):(r=n,t.convertToNoDocument(r.version).setHasCommittedMutations())}function ia(e,t,n,r){return e instanceof aa?function(e,t,n,r){if(!ea(e.precondition,t))return n;const i=e.value.clone(),s=ha(e.fieldTransforms,r,t);return i.setAll(s),t.convertToFoundDocument(t.version,i).setHasLocalMutations(),null}(e,t,n,r):e instanceof ca?function(e,t,n,r){if(!ea(e.precondition,t))return n;const i=ha(e.fieldTransforms,r,t),s=t.data;return s.setAll(ua(e)),s.setAll(i),t.convertToFoundDocument(t.version,s).setHasLocalMutations(),null===n?null:n.unionWith(e.fieldMask.fields).unionWith(e.fieldTransforms.map(e=>e.field))}(e,t,n,r):(i=t,s=n,ea(e.precondition,i)?(i.convertToNoDocument(i.version).setHasLocalMutations(),null):s);var i,s}function sa(e,t){let n=null;for(const r of e.fieldTransforms){const e=t.data.field(r.field),i=qo(r.transform,e||null);null!=i&&(null===n&&(n=_s.empty()),n.set(r.field,i))}return n||null}function oa(e,t){return e.type===t.type&&!!e.key.isEqual(t.key)&&!!e.precondition.isEqual(t.precondition)&&(n=e.fieldTransforms,r=t.fieldTransforms,!!(void 0===n&&void 0===r||n&&r&&sn(n,r,(e,t)=>function(e,t){return e.field.isEqual(t.field)&&(n=e.transform,r=t.transform,n instanceof $o&&r instanceof $o||n instanceof Go&&r instanceof Go?sn(n.elements,r.elements,es):n instanceof Wo&&r instanceof Wo?es(n.Ee,r.Ee):n instanceof zo&&r instanceof zo);var n,r}(e,t)))&&(0===e.type?e.value.isEqual(t.value):1!==e.type||e.data.isEqual(t.data)&&e.fieldMask.isEqual(t.fieldMask)));var n,r}class aa extends ta{constructor(e,t,n,r=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class ca extends ta{constructor(e,t,n,r,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=r,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function ua(e){const t=new Map;return e.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const r=e.data.field(n);t.set(n,r)}}),t}function la(e,t,n){const r=new Map;Vt(e.length===n.length,32656,{Ae:n.length,Re:e.length});for(let i=0;i<n.length;i++){const s=e[i],o=s.transform,a=t.data.field(s.field);r.set(s.field,Bo(o,a,n[i]))}return r}function ha(e,t,n){const r=new Map;for(const i of e){const e=i.transform,s=n.data.field(i.field);r.set(i.field,jo(e,s,t))}return r}class da extends ta{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class fa extends ta{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pa{constructor(e,t,n,r){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=r}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let r=0;r<this.mutations.length;r++){const t=this.mutations[r];t.key.isEqual(e.key)&&ra(t,e,n[r])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=ia(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=ia(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=No();return this.mutations.forEach(r=>{const i=e.get(r.key),s=i.overlayedDocument;let o=this.applyToLocalView(s,i.mutatedFields);o=t.has(r.key)?null:o;const a=na(s,o);null!==a&&n.set(r.key,a),s.isValidDocument()||s.convertToNoDocument(Cn.min())}),n}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),Oo())}isEqual(e){return this.batchId===e.batchId&&sn(this.mutations,e.mutations,(e,t)=>oa(e,t))&&sn(this.baseMutations,e.baseMutations,(e,t)=>oa(e,t))}}class ma{constructor(e,t,n,r){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=r}static from(e,t,n){Vt(e.mutations.length===n.length,58842,{Ve:e.mutations.length,me:n.length});let r=function(){return xo}();const i=e.mutations;for(let s=0;s<i.length;s++)r=r.insert(i[s].key,n[s].version);return new ma(e,t,n,r)}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ga{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return null!==e&&this.mutation===e.mutation}toString(){return`Overlay{\n      largestBatchId: ${this.largestBatchId},\n      mutation: ${this.mutation.toString()}\n    }`}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ya{constructor(e,t,n){this.alias=e,this.aggregateType=t,this.fieldPath=n}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class va{constructor(e,t){this.count=e,this.unchangedNames=t}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var wa,ba;function Ia(e){switch(e){case jt.OK:return Mt(64938);case jt.CANCELLED:case jt.UNKNOWN:case jt.DEADLINE_EXCEEDED:case jt.RESOURCE_EXHAUSTED:case jt.INTERNAL:case jt.UNAVAILABLE:case jt.UNAUTHENTICATED:return!1;case jt.INVALID_ARGUMENT:case jt.NOT_FOUND:case jt.ALREADY_EXISTS:case jt.PERMISSION_DENIED:case jt.FAILED_PRECONDITION:case jt.ABORTED:case jt.OUT_OF_RANGE:case jt.UNIMPLEMENTED:case jt.DATA_LOSS:return!0;default:return Mt(15467,{code:e})}}function _a(e){if(void 0===e)return Ot("GRPC error has no .code"),jt.UNKNOWN;switch(e){case wa.OK:return jt.OK;case wa.CANCELLED:return jt.CANCELLED;case wa.UNKNOWN:return jt.UNKNOWN;case wa.DEADLINE_EXCEEDED:return jt.DEADLINE_EXCEEDED;case wa.RESOURCE_EXHAUSTED:return jt.RESOURCE_EXHAUSTED;case wa.INTERNAL:return jt.INTERNAL;case wa.UNAVAILABLE:return jt.UNAVAILABLE;case wa.UNAUTHENTICATED:return jt.UNAUTHENTICATED;case wa.INVALID_ARGUMENT:return jt.INVALID_ARGUMENT;case wa.NOT_FOUND:return jt.NOT_FOUND;case wa.ALREADY_EXISTS:return jt.ALREADY_EXISTS;case wa.PERMISSION_DENIED:return jt.PERMISSION_DENIED;case wa.FAILED_PRECONDITION:return jt.FAILED_PRECONDITION;case wa.ABORTED:return jt.ABORTED;case wa.OUT_OF_RANGE:return jt.OUT_OF_RANGE;case wa.UNIMPLEMENTED:return jt.UNIMPLEMENTED;case wa.DATA_LOSS:return jt.DATA_LOSS;default:return Mt(39323,{code:e})}}(ba=wa||(wa={}))[ba.OK=0]="OK",ba[ba.CANCELLED=1]="CANCELLED",ba[ba.UNKNOWN=2]="UNKNOWN",ba[ba.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ba[ba.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ba[ba.NOT_FOUND=5]="NOT_FOUND",ba[ba.ALREADY_EXISTS=6]="ALREADY_EXISTS",ba[ba.PERMISSION_DENIED=7]="PERMISSION_DENIED",ba[ba.UNAUTHENTICATED=16]="UNAUTHENTICATED",ba[ba.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ba[ba.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ba[ba.ABORTED=10]="ABORTED",ba[ba.OUT_OF_RANGE=11]="OUT_OF_RANGE",ba[ba.UNIMPLEMENTED=12]="UNIMPLEMENTED",ba[ba.INTERNAL=13]="INTERNAL",ba[ba.UNAVAILABLE=14]="UNAVAILABLE",ba[ba.DATA_LOSS=15]="DATA_LOSS";
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let Ta=null;
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ea=new pt([4294967295,4294967295],0);function Sa(e){const t=Yt().encode(e),n=new mt;return n.update(t),new Uint8Array(n.digest())}function Ca(e){const t=new DataView(e.buffer),n=t.getUint32(0,!0),r=t.getUint32(4,!0),i=t.getUint32(8,!0),s=t.getUint32(12,!0);return[new pt([n,r],0),new pt([i,s],0)]}class Aa{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new ka(`Invalid padding: ${t}`);if(n<0)throw new ka(`Invalid hash count: ${n}`);if(e.length>0&&0===this.hashCount)throw new ka(`Invalid hash count: ${n}`);if(0===e.length&&0!==t)throw new ka(`Invalid padding when bitmap length is 0: ${t}`);this.fe=8*e.length-t,this.ge=pt.fromNumber(this.fe)}pe(e,t,n){let r=e.add(t.multiply(pt.fromNumber(n)));return 1===r.compare(Ea)&&(r=new pt([r.getBits(0),r.getBits(1)],0)),r.modulo(this.ge).toNumber()}ye(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(0===this.fe)return!1;const t=Sa(e),[n,r]=Ca(t);for(let i=0;i<this.hashCount;i++){const e=this.pe(n,r,i);if(!this.ye(e))return!1}return!0}static create(e,t,n){const r=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),s=new Aa(i,r,t);return n.forEach(e=>s.insert(e)),s}insert(e){if(0===this.fe)return;const t=Sa(e),[n,r]=Ca(t);for(let i=0;i<this.hashCount;i++){const e=this.pe(n,r,i);this.we(e)}}we(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class ka extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Na{constructor(e,t,n,r,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=r,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const r=new Map;return r.set(e,Da.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new Na(Cn.min(),r,new Ei(en),Eo(),Oo())}}class Da{constructor(e,t,n,r,i){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=r,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new Da(n,t,Oo(),Oo(),Oo())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xa{constructor(e,t,n,r){this.Se=e,this.removedTargetIds=t,this.key=n,this.be=r}}class Ra{constructor(e,t){this.targetId=e,this.De=t}}class Oa{constructor(e,t,n=Ri.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=r}}class Pa{constructor(){this.ve=0,this.Ce=Fa(),this.Fe=Ri.EMPTY_BYTE_STRING,this.Me=!1,this.xe=!0}get current(){return this.Me}get resumeToken(){return this.Fe}get Oe(){return 0!==this.ve}get Ne(){return this.xe}Be(e){e.approximateByteSize()>0&&(this.xe=!0,this.Fe=e)}Le(){let e=Oo(),t=Oo(),n=Oo();return this.Ce.forEach((r,i)=>{switch(i){case 0:e=e.add(r);break;case 2:t=t.add(r);break;case 1:n=n.add(r);break;default:Mt(38017,{changeType:i})}}),new Da(this.Fe,this.Me,e,t,n)}ke(){this.xe=!1,this.Ce=Fa()}qe(e,t){this.xe=!0,this.Ce=this.Ce.insert(e,t)}Qe(e){this.xe=!0,this.Ce=this.Ce.remove(e)}$e(){this.ve+=1}Ue(){this.ve-=1,Vt(this.ve>=0,3241,{ve:this.ve})}Ke(){this.xe=!0,this.Me=!0}}class La{constructor(e){this.We=e,this.Ge=new Map,this.ze=Eo(),this.je=Ma(),this.Je=Ma(),this.He=new Ei(en)}Ye(e){for(const t of e.Se)e.be&&e.be.isFoundDocument()?this.Ze(t,e.be):this.Xe(t,e.key,e.be);for(const t of e.removedTargetIds)this.Xe(t,e.key,e.be)}et(e){this.forEachTarget(e,t=>{const n=this.tt(t);switch(e.state){case 0:this.nt(t)&&n.Be(e.resumeToken);break;case 1:n.Ue(),n.Oe||n.ke(),n.Be(e.resumeToken);break;case 2:n.Ue(),n.Oe||this.removeTarget(t);break;case 3:this.nt(t)&&(n.Ke(),n.Be(e.resumeToken));break;case 4:this.nt(t)&&(this.rt(t),n.Be(e.resumeToken));break;default:Mt(56790,{state:e.state})}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Ge.forEach((e,n)=>{this.nt(n)&&t(n)})}it(e){const t=e.targetId,n=e.De.count,r=this.st(t);if(r){const i=r.target;if(Zs(i))if(0===n){const e=new dn(i.path);this.Xe(t,e,Es.newNoDocument(e,Cn.min()))}else Vt(1===n,20013,{expectedCount:n});else{const r=this.ot(t);if(r!==n){const n=this._t(e),i=n?this.ut(n,e,r):1;if(0!==i){this.rt(t);const e=2===i?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.He=this.He.insert(t,e)}null==Ta||Ta.ct(function(e,t,n,r,i){var s,o,a,c,u,l;const h={localCacheCount:e,existenceFilterCount:t.count,databaseId:n.database,projectId:n.projectId},d=t.unchangedNames;return d&&(h.bloomFilter={applied:0===i,hashCount:null!==(s=null==d?void 0:d.hashCount)&&void 0!==s?s:0,bitmapLength:null!==(c=null===(a=null===(o=null==d?void 0:d.bits)||void 0===o?void 0:o.bitmap)||void 0===a?void 0:a.length)&&void 0!==c?c:0,padding:null!==(l=null===(u=null==d?void 0:d.bits)||void 0===u?void 0:u.padding)&&void 0!==l?l:0,mightContain:e=>{var t;return null!==(t=null==r?void 0:r.mightContain(e))&&void 0!==t&&t}}),h}(r,e.De,this.We.lt(),n,i))}}}}_t(e){const t=e.De.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:r=0},hashCount:i=0}=t;let s,o;try{s=Mi(n).toUint8Array()}catch(a){if(a instanceof xi)return Pt("Decoding the base64 bloom filter in existence filter failed ("+a.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw a}try{o=new Aa(s,r,i)}catch(a){return Pt(a instanceof ka?"BloomFilter error: ":"Applying bloom filter failed: ",a),null}return 0===o.fe?null:o}ut(e,t,n){return t.De.count===n-this.ht(e,t.targetId)?0:2}ht(e,t){const n=this.We.getRemoteKeysForTarget(t);let r=0;return n.forEach(n=>{const i=this.We.lt(),s=`projects/${i.projectId}/databases/${i.database}/documents/${n.path.canonicalString()}`;e.mightContain(s)||(this.Xe(t,n,null),r++)}),r}Pt(e){const t=new Map;this.Ge.forEach((n,r)=>{const i=this.st(r);if(i){if(n.current&&Zs(i.target)){const t=new dn(i.target.path);this.Tt(t).has(r)||this.It(r,t)||this.Xe(r,t,Es.newNoDocument(t,e))}n.Ne&&(t.set(r,n.Le()),n.ke())}});let n=Oo();this.Je.forEach((e,t)=>{let r=!0;t.forEachWhile(e=>{const t=this.st(e);return!t||"TargetPurposeLimboResolution"===t.purpose||(r=!1,!1)}),r&&(n=n.add(e))}),this.ze.forEach((t,n)=>n.setReadTime(e));const r=new Na(e,t,this.He,this.ze,n);return this.ze=Eo(),this.je=Ma(),this.Je=Ma(),this.He=new Ei(en),r}Ze(e,t){if(!this.nt(e))return;const n=this.It(e,t.key)?2:0;this.tt(e).qe(t.key,n),this.ze=this.ze.insert(t.key,t),this.je=this.je.insert(t.key,this.Tt(t.key).add(e)),this.Je=this.Je.insert(t.key,this.dt(t.key).add(e))}Xe(e,t,n){if(!this.nt(e))return;const r=this.tt(e);this.It(e,t)?r.qe(t,1):r.Qe(t),this.Je=this.Je.insert(t,this.dt(t).delete(e)),this.Je=this.Je.insert(t,this.dt(t).add(e)),n&&(this.ze=this.ze.insert(t,n))}removeTarget(e){this.Ge.delete(e)}ot(e){const t=this.tt(e).Le();return this.We.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.tt(e).$e()}tt(e){let t=this.Ge.get(e);return t||(t=new Pa,this.Ge.set(e,t)),t}dt(e){let t=this.Je.get(e);return t||(t=new Ai(en),this.Je=this.Je.insert(e,t)),t}Tt(e){let t=this.je.get(e);return t||(t=new Ai(en),this.je=this.je.insert(e,t)),t}nt(e){const t=null!==this.st(e);return t||Rt("WatchChangeAggregator","Detected inactive target",e),t}st(e){const t=this.Ge.get(e);return t&&t.Oe?null:this.We.Et(e)}rt(e){this.Ge.set(e,new Pa),this.We.getRemoteKeysForTarget(e).forEach(t=>{this.Xe(e,t,null)})}It(e,t){return this.We.getRemoteKeysForTarget(e).has(t)}}function Ma(){return new Ei(dn.comparator)}function Fa(){return new Ei(dn.comparator)}const Va=(()=>({asc:"ASCENDING",desc:"DESCENDING"}))(),Ua=(()=>({"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"}))(),ja=(()=>({and:"AND",or:"OR"}))();class Ba{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function qa(e,t){return e.useProto3Json||sr(t)?t:{value:t}}function za(e,t){return e.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function $a(e,t){return e.useProto3Json?t.toBase64():t.toUint8Array()}function Ka(e,t){return za(e,t.toTimestamp())}function Ga(e){return Vt(!!e,49232),Cn.fromTimestamp(function(e){const t=Pi(e);return new Sn(t.seconds,t.nanos)}(e))}function Ha(e,t){return Wa(e,t).canonicalString()}function Wa(e,t){const n=(r=e,new un(["projects",r.projectId,"databases",r.database])).child("documents");var r;return void 0===t?n:n.child(t)}function Qa(e){const t=un.fromString(e);return Vt(vc(t),10190,{key:t.toString()}),t}function Ja(e,t){return Ha(e.databaseId,t.path)}function Xa(e,t){const n=Qa(t);if(n.get(1)!==e.databaseId.projectId)throw new Bt(jt.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+e.databaseId.projectId);if(n.get(3)!==e.databaseId.database)throw new Bt(jt.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+e.databaseId.database);return new dn(tc(n))}function Ya(e,t){return Ha(e.databaseId,t)}function Za(e){const t=Qa(e);return 4===t.length?un.emptyPath():tc(t)}function ec(e){return new un(["projects",e.databaseId.projectId,"databases",e.databaseId.database]).canonicalString()}function tc(e){return Vt(e.length>4&&"documents"===e.get(4),29091,{key:e.toString()}),e.popFirst(5)}function nc(e,t,n){return{name:Ja(e,t),fields:n.value.mapValue.fields}}function rc(e,t,n){const r=Xa(e,t.name),i=Ga(t.updateTime),s=t.createTime?Ga(t.createTime):Cn.min(),o=new _s({mapValue:{fields:t.fields}}),a=Es.newFoundDocument(r,i,s,o);return n&&a.setHasCommittedMutations(),n?a.setHasCommittedMutations():a}function ic(e,t){let n;if(t instanceof aa)n={update:nc(e,t.key,t.value)};else if(t instanceof da)n={delete:Ja(e,t.key)};else if(t instanceof ca)n={update:nc(e,t.key,t.data),updateMask:yc(t.fieldMask)};else{if(!(t instanceof fa))return Mt(16599,{Rt:t.type});n={verify:Ja(e,t.key)}}return t.fieldTransforms.length>0&&(n.updateTransforms=t.fieldTransforms.map(e=>function(e,t){const n=t.transform;if(n instanceof zo)return{fieldPath:t.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(n instanceof $o)return{fieldPath:t.field.canonicalString(),appendMissingElements:{values:n.elements}};if(n instanceof Go)return{fieldPath:t.field.canonicalString(),removeAllFromArray:{values:n.elements}};if(n instanceof Wo)return{fieldPath:t.field.canonicalString(),increment:n.Ee};throw Mt(20930,{transform:t.transform})}(0,e))),t.precondition.isNone||(n.currentDocument=(r=e,void 0!==(i=t.precondition).updateTime?{updateTime:Ka(r,i.updateTime)}:void 0!==i.exists?{exists:i.exists}:Mt(27497))),n;var r,i}function sc(e,t){const n=t.currentDocument?void 0!==(i=t.currentDocument).updateTime?Zo.updateTime(Ga(i.updateTime)):void 0!==i.exists?Zo.exists(i.exists):Zo.none():Zo.none(),r=t.updateTransforms?t.updateTransforms.map(t=>function(e,t){let n=null;if("setToServerValue"in t)Vt("REQUEST_TIME"===t.setToServerValue,16630,{proto:t}),n=new zo;else if("appendMissingElements"in t){const e=t.appendMissingElements.values||[];n=new $o(e)}else if("removeAllFromArray"in t){const e=t.removeAllFromArray.values||[];n=new Go(e)}else"increment"in t?n=new Wo(e,t.increment):Mt(16584,{proto:t});const r=hn.fromServerFormat(t.fieldPath);return new Xo(r,n)}(e,t)):[];var i;if(t.update){t.update.name;const i=Xa(e,t.update.name),s=new _s({mapValue:{fields:t.update.fields}});if(t.updateMask){const e=function(e){const t=e.fieldPaths||[];return new Di(t.map(e=>hn.fromServerFormat(e)))}(t.updateMask);return new ca(i,s,e,n,r)}return new aa(i,s,n,r)}if(t.delete){const r=Xa(e,t.delete);return new da(r,n)}if(t.verify){const r=Xa(e,t.verify);return new fa(r,n)}return Mt(1463,{proto:t})}function oc(e,t){return{documents:[Ya(e,t.path)]}}function ac(e,t){const n={structuredQuery:{}},r=t.path;let i;null!==t.collectionGroup?(i=r,n.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(i=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=Ya(e,i);const s=function(e){if(0!==e.length)return gc(Rs.create(e,"and"))}(t.filters);s&&(n.structuredQuery.where=s);const o=function(e){if(0!==e.length)return e.map(e=>{return{field:pc((t=e).field),direction:hc(t.dir)};var t})}(t.orderBy);o&&(n.structuredQuery.orderBy=o);const a=qa(e,t.limit);return null!==a&&(n.structuredQuery.limit=a),t.startAt&&(n.structuredQuery.startAt={before:(c=t.startAt).inclusive,values:c.position}),t.endAt&&(n.structuredQuery.endAt=function(e){return{before:!e.inclusive,values:e.position}}(t.endAt)),{Vt:n,parent:i};var c}function cc(e,t,n,r){const{Vt:i,parent:s}=ac(e,t),o={},a=[];let c=0;return n.forEach(e=>{const t=r?e.alias:"aggregate_"+c++;o[t]=e.alias,"count"===e.aggregateType?a.push({alias:t,count:{}}):"avg"===e.aggregateType?a.push({alias:t,avg:{field:pc(e.fieldPath)}}):"sum"===e.aggregateType&&a.push({alias:t,sum:{field:pc(e.fieldPath)}})}),{request:{structuredAggregationQuery:{aggregations:a,structuredQuery:i.structuredQuery},parent:i.parent},ft:o,parent:s}}function uc(e){let t=Za(e.parent);const n=e.structuredQuery,r=n.from?n.from.length:0;let i=null;if(r>0){Vt(1===r,65062);const e=n.from[0];e.allDescendants?i=e.collectionId:t=t.child(e.collectionId)}let s=[];n.where&&(s=function(e){const t=lc(e);return t instanceof Rs&&Ls(t)?t.getFilters():[t]}(n.where));let o=[];n.orderBy&&(o=n.orderBy.map(e=>{return new ks(mc((t=e).field),function(e){switch(e){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(t.direction));var t}));let a=null;n.limit&&(a=function(e){let t;return t="object"==typeof e?e.value:e,sr(t)?null:t}(n.limit));let c=null;n.startAt&&(c=function(e){const t=!!e.before,n=e.values||[];return new Ss(n,t)}(n.startAt));let u=null;return n.endAt&&(u=function(e){const t=!e.before,n=e.values||[];return new Ss(n,t)}(n.endAt)),io(t,i,o,s,a,"F",c,u)}function lc(e){return void 0!==e.unaryFilter?function(e){switch(e.unaryFilter.op){case"IS_NAN":const t=mc(e.unaryFilter.field);return xs.create(t,"==",{doubleValue:NaN});case"IS_NULL":const n=mc(e.unaryFilter.field);return xs.create(n,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const r=mc(e.unaryFilter.field);return xs.create(r,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const i=mc(e.unaryFilter.field);return xs.create(i,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return Mt(61313);default:return Mt(60726)}}(e):void 0!==e.fieldFilter?(t=e,xs.create(mc(t.fieldFilter.field),function(e){switch(e){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return Mt(58110);default:return Mt(50506)}}(t.fieldFilter.op),t.fieldFilter.value)):void 0!==e.compositeFilter?function(e){return Rs.create(e.compositeFilter.filters.map(e=>lc(e)),function(e){switch(e){case"AND":return"and";case"OR":return"or";default:return Mt(1026)}}(e.compositeFilter.op))}(e):Mt(30097,{filter:e});var t}function hc(e){return Va[e]}function dc(e){return Ua[e]}function fc(e){return ja[e]}function pc(e){return{fieldPath:e.canonicalString()}}function mc(e){return hn.fromServerFormat(e.fieldPath)}function gc(e){return e instanceof xs?function(e){if("=="===e.op){if(ds(e.value))return{unaryFilter:{field:pc(e.field),op:"IS_NAN"}};if(hs(e.value))return{unaryFilter:{field:pc(e.field),op:"IS_NULL"}}}else if("!="===e.op){if(ds(e.value))return{unaryFilter:{field:pc(e.field),op:"IS_NOT_NAN"}};if(hs(e.value))return{unaryFilter:{field:pc(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:pc(e.field),op:dc(e.op),value:e.value}}}(e):e instanceof Rs?function(e){const t=e.getFilters().map(e=>gc(e));return 1===t.length?t[0]:{compositeFilter:{op:fc(e.op),filters:t}}}(e):Mt(54877,{filter:e})}function yc(e){const t=[];return e.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}function vc(e){return e.length>=4&&"projects"===e.get(0)&&"databases"===e.get(2)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wc{constructor(e,t,n,r,i=Cn.min(),s=Cn.min(),o=Ri.EMPTY_BYTE_STRING,a=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=r,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=s,this.resumeToken=o,this.expectedCount=a}withSequenceNumber(e){return new wc(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new wc(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new wc(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new wc(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bc{constructor(e){this.gt=e}}function Ic(e,t){const n=t.key,r={prefixPath:n.getCollectionPath().popLast().toArray(),collectionGroup:n.collectionGroup,documentId:n.path.lastSegment(),readTime:_c(t.readTime),hasCommittedMutations:t.hasCommittedMutations};if(t.isFoundDocument())r.document={name:Ja(i=e.gt,(s=t).key),fields:s.data.value.mapValue.fields,updateTime:za(i,s.version.toTimestamp()),createTime:za(i,s.createTime.toTimestamp())};else if(t.isNoDocument())r.noDocument={path:n.path.toArray(),readTime:Tc(t.version)};else{if(!t.isUnknownDocument())return Mt(57904,{document:t});r.unknownDocument={path:n.path.toArray(),version:Tc(t.version)}}var i,s;return r}function _c(e){const t=e.toTimestamp();return[t.seconds,t.nanoseconds]}function Tc(e){const t=e.toTimestamp();return{seconds:t.seconds,nanoseconds:t.nanoseconds}}function Ec(e){const t=new Sn(e.seconds,e.nanoseconds);return Cn.fromTimestamp(t)}function Sc(e,t){const n=(t.baseMutations||[]).map(t=>sc(e.gt,t));for(let s=0;s<t.mutations.length-1;++s){const e=t.mutations[s];if(s+1<t.mutations.length&&void 0!==t.mutations[s+1].transform){const n=t.mutations[s+1];e.updateTransforms=n.transform.fieldTransforms,t.mutations.splice(s+1,1),++s}}const r=t.mutations.map(t=>sc(e.gt,t)),i=Sn.fromMillis(t.localWriteTimeMs);return new pa(t.batchId,i,n,r)}function Cc(e){const t=Ec(e.readTime),n=void 0!==e.lastLimboFreeSnapshotVersion?Ec(e.lastLimboFreeSnapshotVersion):Cn.min();let r;return r=void 0!==e.query.documents?function(e){const t=e.documents.length;return Vt(1===t,1966,{count:t}),uo(so(Za(e.documents[0])))}(e.query):function(e){return uo(uc(e))}(e.query),new wc(r,e.targetId,"TargetPurposeListen",e.lastListenSequenceNumber,t,n,Ri.fromBase64String(e.resumeToken))}function Ac(e,t){const n=Tc(t.snapshotVersion),r=Tc(t.lastLimboFreeSnapshotVersion);let i;i=Zs(t.target)?oc(e.gt,t.target):ac(e.gt,t.target).Vt;const s=t.resumeToken.toBase64();return{targetId:t.targetId,canonicalId:Xs(t.target),readTime:n,resumeToken:s,lastListenSequenceNumber:t.sequenceNumber,lastLimboFreeSnapshotVersion:r,query:i}}function kc(e){const t=uc({parent:e.parent,structuredQuery:e.structuredQuery});return"LAST"===e.limitType?po(t,t.limit,"L"):t}function Nc(e,t){return new ga(t.largestBatchId,sc(e.gt,t.overlayMutation))}function Dc(e,t){const n=t.path.lastSegment();return[e,ur(t.path.popLast()),n]}function xc(e,t,n,r){return{indexId:e,uid:t,sequenceNumber:n,readTime:Tc(r.readTime),documentKey:ur(r.documentKey.path),largestBatchId:r.largestBatchId}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rc{getBundleMetadata(e,t){return Oc(e).get(t).next(e=>{if(e)return{id:(t=e).bundleId,createTime:Ec(t.createTime),version:t.version};var t})}saveBundleMetadata(e,t){return Oc(e).put({bundleId:(n=t).id,createTime:Tc(Ga(n.createTime)),version:n.version});var n}getNamedQuery(e,t){return Pc(e).get(t).next(e=>{if(e)return{name:(t=e).name,query:kc(t.bundledQuery),readTime:Ec(t.readTime)};var t})}saveNamedQuery(e,t){return Pc(e).put({name:(n=t).name,readTime:Tc(Ga(n.readTime)),bundledQuery:n.bundledQuery});var n}}function Oc(e){return wi(e,Kr)}function Pc(e){return wi(e,Gr)}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lc{constructor(e,t){this.serializer=e,this.userId=t}static yt(e,t){const n=t.uid||"";return new Lc(e,n)}getOverlay(e,t){return Mc(e).get(Dc(this.userId,t)).next(e=>e?Nc(this.serializer,e):null)}getOverlays(e,t){const n=ko();return qn.forEach(t,t=>this.getOverlay(e,t).next(e=>{null!==e&&n.set(t,e)})).next(()=>n)}saveOverlays(e,t,n){const r=[];return n.forEach((n,i)=>{const s=new ga(t,i);r.push(this.wt(e,s))}),qn.waitFor(r)}removeOverlaysForBatchId(e,t,n){const r=new Set;t.forEach(e=>r.add(ur(e.getCollectionPath())));const i=[];return r.forEach(t=>{const r=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,n+1],!1,!0);i.push(Mc(e).Y(si,r))}),qn.waitFor(i)}getOverlaysForCollection(e,t,n){const r=ko(),i=ur(t),s=IDBKeyRange.bound([this.userId,i,n],[this.userId,i,Number.POSITIVE_INFINITY],!0);return Mc(e).j(si,s).next(e=>{for(const t of e){const e=Nc(this.serializer,t);r.set(e.getKey(),e)}return r})}getOverlaysForCollectionGroup(e,t,n,r){const i=ko();let s;const o=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,Number.POSITIVE_INFINITY],!0);return Mc(e).X({index:ai,range:o},(e,t,n)=>{const o=Nc(this.serializer,t);i.size()<r||o.largestBatchId===s?(i.set(o.getKey(),o),s=o.largestBatchId):n.done()}).next(()=>i)}wt(e,t){return Mc(e).put(function(e,t,n){const[r,i,s]=Dc(t,n.mutation.key);return{userId:t,collectionPath:i,documentId:s,collectionGroup:n.mutation.key.getCollectionGroup(),largestBatchId:n.largestBatchId,overlayMutation:ic(e.gt,n.mutation)}}(this.serializer,this.userId,t))}}function Mc(e){return wi(e,ri)}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fc{St(e){return wi(e,ui)}getSessionToken(e){return this.St(e).get("sessionToken").next(e=>{const t=null==e?void 0:e.value;return t?Ri.fromUint8Array(t):Ri.EMPTY_BYTE_STRING})}setSessionToken(e,t){return this.St(e).put({name:"sessionToken",value:t.toUint8Array()})}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vc{constructor(){}bt(e,t){this.Dt(e,t),t.vt()}Dt(e,t){if("nullValue"in e)this.Ct(t,5);else if("booleanValue"in e)this.Ct(t,10),t.Ft(e.booleanValue?1:0);else if("integerValue"in e)this.Ct(t,15),t.Ft(Li(e.integerValue));else if("doubleValue"in e){const n=Li(e.doubleValue);isNaN(n)?this.Ct(t,13):(this.Ct(t,15),or(n)?t.Ft(0):t.Ft(n))}else if("timestampValue"in e){let n=e.timestampValue;this.Ct(t,20),"string"==typeof n&&(n=Pi(n)),t.Mt(`${n.seconds||""}`),t.Ft(n.nanos||0)}else if("stringValue"in e)this.xt(e.stringValue,t),this.Ot(t);else if("bytesValue"in e)this.Ct(t,30),t.Nt(Mi(e.bytesValue)),this.Ot(t);else if("referenceValue"in e)this.Bt(e.referenceValue,t);else if("geoPointValue"in e){const n=e.geoPointValue;this.Ct(t,45),t.Ft(n.latitude||0),t.Ft(n.longitude||0)}else"mapValue"in e?gs(e)?this.Ct(t,Number.MAX_SAFE_INTEGER):ps(e)?this.Lt(e.mapValue,t):(this.kt(e.mapValue,t),this.Ot(t)):"arrayValue"in e?(this.qt(e.arrayValue,t),this.Ot(t)):Mt(19022,{Qt:e})}xt(e,t){this.Ct(t,25),this.$t(e,t)}$t(e,t){t.Mt(e)}kt(e,t){const n=e.fields||{};this.Ct(t,55);for(const r of Object.keys(n))this.xt(r,t),this.Dt(n[r],t)}Lt(e,t){var n,r;const i=e.fields||{};this.Ct(t,53);const s=Xi,o=(null===(r=null===(n=i[s].arrayValue)||void 0===n?void 0:n.values)||void 0===r?void 0:r.length)||0;this.Ct(t,15),t.Ft(Li(o)),this.xt(s,t),this.Dt(i[s],t)}qt(e,t){const n=e.values||[];this.Ct(t,50);for(const r of n)this.Dt(r,t)}Bt(e,t){this.Ct(t,37),dn.fromName(e).path.forEach(e=>{this.Ct(t,60),this.$t(e,t)})}Ct(e,t){e.Ft(t)}Ot(e){e.Ft(2)}}Vc.Ut=new Vc;
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law | agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Uc=255;function jc(e){if(0===e)return 8;let t=0;return e>>4||(t+=4,e<<=4),e>>6||(t+=2,e<<=2),e>>7||(t+=1),t}function Bc(e){const t=64-function(e){let t=0;for(let n=0;n<8;++n){const r=jc(255&e[n]);if(t+=r,8!==r)break}return t}(e);return Math.ceil(t/8)}class qc{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Kt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Wt(n.value),n=t.next();this.Gt()}zt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.jt(n.value),n=t.next();this.Jt()}Ht(e){for(const t of e){const e=t.charCodeAt(0);if(e<128)this.Wt(e);else if(e<2048)this.Wt(960|e>>>6),this.Wt(128|63&e);else if(t<"\ud800"||"\udbff"<t)this.Wt(480|e>>>12),this.Wt(128|63&e>>>6),this.Wt(128|63&e);else{const e=t.codePointAt(0);this.Wt(240|e>>>18),this.Wt(128|63&e>>>12),this.Wt(128|63&e>>>6),this.Wt(128|63&e)}}this.Gt()}Yt(e){for(const t of e){const e=t.charCodeAt(0);if(e<128)this.jt(e);else if(e<2048)this.jt(960|e>>>6),this.jt(128|63&e);else if(t<"\ud800"||"\udbff"<t)this.jt(480|e>>>12),this.jt(128|63&e>>>6),this.jt(128|63&e);else{const e=t.codePointAt(0);this.jt(240|e>>>18),this.jt(128|63&e>>>12),this.jt(128|63&e>>>6),this.jt(128|63&e)}}this.Jt()}Zt(e){const t=this.Xt(e),n=Bc(t);this.en(1+n),this.buffer[this.position++]=255&n;for(let r=t.length-n;r<t.length;++r)this.buffer[this.position++]=255&t[r]}tn(e){const t=this.Xt(e),n=Bc(t);this.en(1+n),this.buffer[this.position++]=~(255&n);for(let r=t.length-n;r<t.length;++r)this.buffer[this.position++]=~(255&t[r])}nn(){this.rn(Uc),this.rn(255)}sn(){this._n(Uc),this._n(255)}reset(){this.position=0}seed(e){this.en(e.length),this.buffer.set(e,this.position),this.position+=e.length}an(){return this.buffer.slice(0,this.position)}Xt(e){const t=function(e){const t=new DataView(new ArrayBuffer(8));return t.setFloat64(0,e,!1),new Uint8Array(t.buffer)}(e),n=!!(128&t[0]);t[0]^=n?255:128;for(let r=1;r<t.length;++r)t[r]^=n?255:0;return t}Wt(e){const t=255&e;0===t?(this.rn(0),this.rn(255)):t===Uc?(this.rn(Uc),this.rn(0)):this.rn(t)}jt(e){const t=255&e;0===t?(this._n(0),this._n(255)):t===Uc?(this._n(Uc),this._n(0)):this._n(e)}Gt(){this.rn(0),this.rn(1)}Jt(){this._n(0),this._n(1)}rn(e){this.en(1),this.buffer[this.position++]=e}_n(e){this.en(1),this.buffer[this.position++]=~e}en(e){const t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);const r=new Uint8Array(n);r.set(this.buffer),this.buffer=r}}class zc{constructor(e){this.un=e}Nt(e){this.un.Kt(e)}Mt(e){this.un.Ht(e)}Ft(e){this.un.Zt(e)}vt(){this.un.nn()}}class $c{constructor(e){this.un=e}Nt(e){this.un.zt(e)}Mt(e){this.un.Yt(e)}Ft(e){this.un.tn(e)}vt(){this.un.sn()}}class Kc{constructor(){this.un=new qc,this.cn=new zc(this.un),this.ln=new $c(this.un)}seed(e){this.un.seed(e)}hn(e){return 0===e?this.cn:this.ln}an(){return this.un.an()}reset(){this.un.reset()}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gc{constructor(e,t,n,r){this.Pn=e,this.Tn=t,this.In=n,this.dn=r}En(){const e=this.dn.length,t=0===e||255===this.dn[e-1]?e+1:e,n=new Uint8Array(t);return n.set(this.dn,0),t!==e?n.set([0],this.dn.length):++n[n.length-1],new Gc(this.Pn,this.Tn,this.In,n)}An(e,t,n){return{indexId:this.Pn,uid:e,arrayValue:Qc(this.In),directionalValue:Qc(this.dn),orderedDocumentKey:Qc(t),documentKey:n.path.toArray()}}Rn(e,t,n){const r=this.An(e,t,n);return[r.indexId,r.uid,r.arrayValue,r.directionalValue,r.orderedDocumentKey,r.documentKey]}}function Hc(e,t){let n=e.Pn-t.Pn;return 0!==n?n:(n=Wc(e.In,t.In),0!==n?n:(n=Wc(e.dn,t.dn),0!==n?n:dn.comparator(e.Tn,t.Tn)))}function Wc(e,t){for(let n=0;n<e.length&&n<t.length;++n){const r=e[n]-t[n];if(0!==r)return r}return e.length-t.length}function Qc(e){return T()?function(e){let t="";for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return t}(e):e}function Jc(e){return"string"!=typeof e?e:function(e){const t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}(e)}class Xc{constructor(e){this.Vn=new Ai((e,t)=>hn.comparator(e.field,t.field)),this.collectionId=null!=e.collectionGroup?e.collectionGroup:e.path.lastSegment(),this.mn=e.orderBy,this.fn=[];for(const t of e.filters){const e=t;e.isInequality()?this.Vn=this.Vn.add(e):this.fn.push(e)}}get gn(){return this.Vn.size>1}pn(e){if(Vt(e.collectionGroup===this.collectionId,49279),this.gn)return!1;const t=Nn(e);if(void 0!==t&&!this.yn(t))return!1;const n=Dn(e);let r=new Set,i=0,s=0;for(;i<n.length&&this.yn(n[i]);++i)r=r.add(n[i].fieldPath.canonicalString());if(i===n.length)return!0;if(this.Vn.size>0){const e=this.Vn.getIterator().getNext();if(!r.has(e.field.canonicalString())){const t=n[i];if(!this.wn(e,t)||!this.Sn(this.mn[s++],t))return!1}++i}for(;i<n.length;++i){const e=n[i];if(s>=this.mn.length||!this.Sn(this.mn[s++],e))return!1}return!0}bn(){if(this.gn)return null;let e=new Ai(hn.comparator);const t=[];for(const n of this.fn)if(!n.field.isKeyField())if("array-contains"===n.op||"array-contains-any"===n.op)t.push(new Rn(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new Rn(n.field,0))}for(const n of this.mn)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new Rn(n.field,"asc"===n.dir?0:1)));return new kn(kn.UNKNOWN_ID,this.collectionId,t,Pn.empty())}yn(e){for(const t of this.fn)if(this.wn(t,e))return!0;return!1}wn(e,t){if(void 0===e||!e.field.isEqual(t.fieldPath))return!1;const n="array-contains"===e.op||"array-contains-any"===e.op;return 2===t.kind===n}Sn(e,t){return!!e.field.isEqual(t.fieldPath)&&(0===t.kind&&"asc"===e.dir||1===t.kind&&"desc"===e.dir)}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yc(e){var t,n;if(Vt(e instanceof xs||e instanceof Rs,20012),e instanceof xs){if(e instanceof Gs){const r=(null===(n=null===(t=e.value.arrayValue)||void 0===t?void 0:t.values)||void 0===n?void 0:n.map(t=>xs.create(e.field,"==",t)))||[];return Rs.create(r,"or")}return e}const r=e.filters.map(e=>Yc(e));return Rs.create(r,e.op)}function Zc(e){if(0===e.getFilters().length)return[];const t=ru(Yc(e));return Vt(nu(t),7391),eu(t)||tu(t)?[t]:t.getFilters()}function eu(e){return e instanceof xs}function tu(e){return e instanceof Rs&&Ls(e)}function nu(e){return eu(e)||tu(e)||function(e){if(e instanceof Rs&&Ps(e)){for(const t of e.getFilters())if(!eu(t)&&!tu(t))return!1;return!0}return!1}(e)}function ru(e){if(Vt(e instanceof xs||e instanceof Rs,34018),e instanceof xs)return e;if(1===e.filters.length)return ru(e.filters[0]);const t=e.filters.map(e=>ru(e));let n=Rs.create(t,e.op);return n=ou(n),nu(n)?n:(Vt(n instanceof Rs,64498),Vt(Os(n),40251),Vt(n.filters.length>1,57927),n.filters.reduce((e,t)=>iu(e,t)))}function iu(e,t){let n;return Vt(e instanceof xs||e instanceof Rs,38388),Vt(t instanceof xs||t instanceof Rs,25473),n=e instanceof xs?t instanceof xs?(r=e,i=t,Rs.create([r,i],"and")):su(e,t):t instanceof xs?su(t,e):function(e,t){if(Vt(e.filters.length>0&&t.filters.length>0,48005),Os(e)&&Os(t))return Us(e,t.getFilters());const n=Ps(e)?e:t,r=Ps(e)?t:e,i=n.filters.map(e=>iu(e,r));return Rs.create(i,"or")}(e,t),ou(n);var r,i}function su(e,t){if(Os(t))return Us(t,e.getFilters());{const n=t.filters.map(t=>iu(e,t));return Rs.create(n,"or")}}function ou(e){if(Vt(e instanceof xs||e instanceof Rs,11850),e instanceof xs)return e;const t=e.getFilters();if(1===t.length)return ou(t[0]);if(Ms(e))return e;const n=t.map(e=>ou(e)),r=[];return n.forEach(t=>{t instanceof xs?r.push(t):t instanceof Rs&&(t.op===e.op?r.push(...t.filters):r.push(t))}),1===r.length?r[0]:Rs.create(r,e.op)
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class au{constructor(){this.Dn=new cu}addToCollectionParentIndex(e,t){return this.Dn.add(t),qn.resolve()}getCollectionParents(e,t){return qn.resolve(this.Dn.getEntries(t))}addFieldIndex(e,t){return qn.resolve()}deleteFieldIndex(e,t){return qn.resolve()}deleteAllFieldIndexes(e){return qn.resolve()}createTargetIndexes(e,t){return qn.resolve()}getDocumentsMatchingTarget(e,t){return qn.resolve(null)}getIndexType(e,t){return qn.resolve(0)}getFieldIndexes(e,t){return qn.resolve([])}getNextCollectionGroupToUpdate(e){return qn.resolve(null)}getMinOffset(e,t){return qn.resolve(Fn.min())}getMinOffsetFromCollectionGroup(e,t){return qn.resolve(Fn.min())}updateCollectionGroup(e,t,n){return qn.resolve()}updateIndexEntries(e,t){return qn.resolve()}}class cu{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),r=this.index[t]||new Ai(un.comparator),i=!r.has(n);return this.index[t]=r.add(n),i}has(e){const t=e.lastSegment(),n=e.popLast(),r=this.index[t];return r&&r.has(n)}getEntries(e){return(this.index[e]||new Ai(un.comparator)).toArray()}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uu="IndexedDbIndexManager",lu=new Uint8Array(0);class hu{constructor(e,t){this.databaseId=t,this.vn=new cu,this.Cn=new _o(e=>Xs(e),(e,t)=>Ys(e,t)),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.vn.has(t)){const n=t.lastSegment(),r=t.popLast();e.addOnCommittedListener(()=>{this.vn.add(t)});const i={collectionId:n,parent:ur(r)};return du(e).put(i)}return qn.resolve()}getCollectionParents(e,t){const n=[],r=IDBKeyRange.bound([t,""],[on(t),""],!1,!0);return du(e).j(r).next(e=>{for(const r of e){if(r.collectionId!==t)break;n.push(dr(r.parent))}return n})}addFieldIndex(e,t){const n=pu(e),r={indexId:(i=t).indexId,collectionGroup:i.collectionGroup,fields:i.fields.map(e=>[e.fieldPath.canonicalString(),e.kind])};var i;delete r.indexId;const s=n.add(r);if(t.indexState){const n=mu(e);return s.next(e=>{n.put(xc(e,this.uid,t.indexState.sequenceNumber,t.indexState.offset))})}return s.next()}deleteFieldIndex(e,t){const n=pu(e),r=mu(e),i=fu(e);return n.delete(t.indexId).next(()=>r.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))).next(()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))}deleteAllFieldIndexes(e){const t=pu(e),n=fu(e),r=mu(e);return t.Y().next(()=>n.Y()).next(()=>r.Y())}createTargetIndexes(e,t){return qn.forEach(this.Fn(t),t=>this.getIndexType(e,t).next(n=>{if(0===n||1===n){const n=new Xc(t).bn();if(null!=n)return this.addFieldIndex(e,n)}}))}getDocumentsMatchingTarget(e,t){const n=fu(e);let r=!0;const i=new Map;return qn.forEach(this.Fn(t),t=>this.Mn(e,t).next(e=>{r&&(r=!!e),i.set(t,e)})).next(()=>{if(r){let e=Oo();const r=[];return qn.forEach(i,(i,s)=>{var o;Rt(uu,`Using index ${o=i,`id=${o.indexId}|cg=${o.collectionGroup}|f=${o.fields.map(e=>`${e.fieldPath}:${e.kind}`).join(",")}`} to execute ${Xs(t)}`);const a=function(e,t){const n=Nn(t);if(void 0===n)return null;for(const r of eo(e,n.fieldPath))switch(r.op){case"array-contains-any":return r.value.arrayValue.values||[];case"array-contains":return[r.value]}return null}(s,i),c=function(e,t){const n=new Map;for(const r of Dn(t))for(const t of eo(e,r.fieldPath))switch(t.op){case"==":case"in":n.set(r.fieldPath.canonicalString(),t.value);break;case"not-in":case"!=":return n.set(r.fieldPath.canonicalString(),t.value),Array.from(n.values())}return null}(s,i),u=function(e,t){const n=[];let r=!0;for(const i of Dn(t)){const t=0===i.kind?to(e,i.fieldPath,e.startAt):no(e,i.fieldPath,e.startAt);n.push(t.value),r&&(r=t.inclusive)}return new Ss(n,r)}(s,i),l=function(e,t){const n=[];let r=!0;for(const i of Dn(t)){const t=0===i.kind?no(e,i.fieldPath,e.endAt):to(e,i.fieldPath,e.endAt);n.push(t.value),r&&(r=t.inclusive)}return new Ss(n,r)}(s,i),h=this.xn(i,s,u),d=this.xn(i,s,l),f=this.On(i,s,c),p=this.Nn(i.indexId,a,h,u.inclusive,d,l.inclusive,f);return qn.forEach(p,i=>n.H(i,t.limit).next(t=>{t.forEach(t=>{const n=dn.fromSegments(t.documentKey);e.has(n)||(e=e.add(n),r.push(n))})}))}).next(()=>r)}return qn.resolve(null)})}Fn(e){let t=this.Cn.get(e);return t||(t=0===e.filters.length?[e]:Zc(Rs.create(e.filters,"and")).map(t=>Js(e.path,e.collectionGroup,e.orderBy,t.getFilters(),e.limit,e.startAt,e.endAt)),this.Cn.set(e,t),t)}Nn(e,t,n,r,i,s,o){const a=(null!=t?t.length:1)*Math.max(n.length,i.length),c=a/(null!=t?t.length:1),u=[];for(let l=0;l<a;++l){const a=t?this.Bn(t[l/c]):lu,h=this.Ln(e,a,n[l%c],r),d=this.kn(e,a,i[l%c],s),f=o.map(t=>this.Ln(e,a,t,!0));u.push(...this.createRange(h,d,f))}return u}Ln(e,t,n,r){const i=new Gc(e,dn.empty(),t,n);return r?i:i.En()}kn(e,t,n,r){const i=new Gc(e,dn.empty(),t,n);return r?i.En():i}Mn(e,t){const n=new Xc(t),r=null!=t.collectionGroup?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,r).next(e=>{let t=null;for(const r of e)n.pn(r)&&(!t||r.fields.length>t.fields.length)&&(t=r);return t})}getIndexType(e,t){let n=2;const r=this.Fn(t);return qn.forEach(r,t=>this.Mn(e,t).next(e=>{e?0!==n&&e.fields.length<function(e){let t=new Ai(hn.comparator),n=!1;for(const r of e.filters)for(const e of r.getFlattenedFilters())e.field.isKeyField()||("array-contains"===e.op||"array-contains-any"===e.op?n=!0:t=t.add(e.field));for(const r of e.orderBy)r.field.isKeyField()||(t=t.add(r.field));return t.size+(n?1:0)}(t)&&(n=1):n=0})).next(()=>null!==t.limit&&r.length>1&&2===n?1:n)}qn(e,t){const n=new Kc;for(const r of Dn(e)){const e=t.data.field(r.fieldPath);if(null==e)return null;const i=n.hn(r.kind);Vc.Ut.bt(e,i)}return n.an()}Bn(e){const t=new Kc;return Vc.Ut.bt(e,t.hn(0)),t.an()}Qn(e,t){const n=new Kc;return Vc.Ut.bt(cs(this.databaseId,t),n.hn(function(e){const t=Dn(e);return 0===t.length?0:t[t.length-1].kind}(e))),n.an()}On(e,t,n){if(null===n)return[];let r=[];r.push(new Kc);let i=0;for(const s of Dn(e)){const e=n[i++];for(const n of r)if(this.$n(t,s.fieldPath)&&ls(e))r=this.Un(r,s,e);else{const t=n.hn(s.kind);Vc.Ut.bt(e,t)}}return this.Kn(r)}xn(e,t,n){return this.On(e,t,n.position)}Kn(e){const t=[];for(let n=0;n<e.length;++n)t[n]=e[n].an();return t}Un(e,t,n){const r=[...e],i=[];for(const s of n.arrayValue.values||[])for(const e of r){const n=new Kc;n.seed(e.an()),Vc.Ut.bt(s,n.hn(t.kind)),i.push(n)}return i}$n(e,t){return!!e.filters.find(e=>e instanceof xs&&e.field.isEqual(t)&&("in"===e.op||"not-in"===e.op))}getFieldIndexes(e,t){const n=pu(e),r=mu(e);return(t?n.j(Wr,IDBKeyRange.bound(t,t)):n.j()).next(e=>{const t=[];return qn.forEach(e,e=>r.get([e.indexId,this.uid]).next(n=>{t.push(function(e,t){const n=t?new Pn(t.sequenceNumber,new Fn(Ec(t.readTime),new dn(dr(t.documentKey)),t.largestBatchId)):Pn.empty(),r=e.fields.map(([e,t])=>new Rn(hn.fromServerFormat(e),t));return new kn(e.indexId,e.collectionGroup,r,n)}(e,n))})).next(()=>t)})}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next(e=>0===e.length?null:(e.sort((e,t)=>{const n=e.indexState.sequenceNumber-t.indexState.sequenceNumber;return 0!==n?n:en(e.collectionGroup,t.collectionGroup)}),e[0].collectionGroup))}updateCollectionGroup(e,t,n){const r=pu(e),i=mu(e);return this.Wn(e).next(e=>r.j(Wr,IDBKeyRange.bound(t,t)).next(t=>qn.forEach(t,t=>i.put(xc(t.indexId,this.uid,e,n)))))}updateIndexEntries(e,t){const n=new Map;return qn.forEach(t,(t,r)=>{const i=n.get(t.collectionGroup);return(i?qn.resolve(i):this.getFieldIndexes(e,t.collectionGroup)).next(i=>(n.set(t.collectionGroup,i),qn.forEach(i,n=>this.Gn(e,t,n).next(t=>{const i=this.zn(r,n);return t.isEqual(i)?qn.resolve():this.jn(e,r,n,t,i)}))))})}Jn(e,t,n,r){return fu(e).put(r.An(this.uid,this.Qn(n,t.key),t.key))}Hn(e,t,n,r){return fu(e).delete(r.Rn(this.uid,this.Qn(n,t.key),t.key))}Gn(e,t,n){const r=fu(e);let i=new Ai(Hc);return r.X({index:ti,range:IDBKeyRange.only([n.indexId,this.uid,Qc(this.Qn(n,t))])},(e,r)=>{i=i.add(new Gc(n.indexId,t,Jc(r.arrayValue),Jc(r.directionalValue)))}).next(()=>i)}zn(e,t){let n=new Ai(Hc);const r=this.qn(t,e);if(null==r)return n;const i=Nn(t);if(null!=i){const s=e.data.field(i.fieldPath);if(ls(s))for(const i of s.arrayValue.values||[])n=n.add(new Gc(t.indexId,e.key,this.Bn(i),r))}else n=n.add(new Gc(t.indexId,e.key,lu,r));return n}jn(e,t,n,r,i){Rt(uu,"Updating index entries for document '%s'",t.key);const s=[];return function(e,t,n,r,i){const s=e.getIterator(),o=t.getIterator();let a=Ni(s),c=Ni(o);for(;a||c;){let e=!1,t=!1;if(a&&c){const r=n(a,c);r<0?t=!0:r>0&&(e=!0)}else null!=a?t=!0:e=!0;e?(r(c),c=Ni(o)):t?(i(a),a=Ni(s)):(a=Ni(s),c=Ni(o))}}(r,i,Hc,r=>{s.push(this.Jn(e,t,n,r))},r=>{s.push(this.Hn(e,t,n,r))}),qn.waitFor(s)}Wn(e){let t=1;return mu(e).X({index:Xr,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},(e,n,r)=>{r.done(),t=n.sequenceNumber+1}).next(()=>t)}createRange(e,t,n){n=n.sort((e,t)=>Hc(e,t)).filter((e,t,n)=>!t||0!==Hc(e,n[t-1]));const r=[];r.push(e);for(const s of n){const n=Hc(s,e),i=Hc(s,t);if(0===n)r[0]=e.En();else if(n>0&&i<0)r.push(s),r.push(s.En());else if(i>0)break}r.push(t);const i=[];for(let s=0;s<r.length;s+=2){if(this.Yn(r[s],r[s+1]))return[];const e=r[s].Rn(this.uid,lu,dn.empty()),t=r[s+1].Rn(this.uid,lu,dn.empty());i.push(IDBKeyRange.bound(e,t))}return i}Yn(e,t){return Hc(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(gu)}getMinOffset(e,t){return qn.mapArray(this.Fn(t),t=>this.Mn(e,t).next(e=>e||Mt(44426))).next(gu)}}function du(e){return wi(e,qr)}function fu(e){return wi(e,Zr)}function pu(e){return wi(e,Hr)}function mu(e){return wi(e,Qr)}function gu(e){Vt(0!==e.length,28825);let t=e[0].indexState.offset,n=t.largestBatchId;for(let r=1;r<e.length;r++){const i=e[r].indexState.offset;Vn(i,t)<0&&(t=i),n<i.largestBatchId&&(n=i.largestBatchId)}return new Fn(t.readTime,t.documentKey,n)}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yu={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},vu=41943040;class wu{static withCacheSize(e){return new wu(e,wu.DEFAULT_COLLECTION_PERCENTILE,wu.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bu(e,t,n){const r=e.store(yr),i=e.store(Er),s=[],o=IDBKeyRange.only(n.batchId);let a=0;const c=r.X({range:o},(e,t,n)=>(a++,n.delete()));s.push(c.next(()=>{Vt(1===a,47070,{batchId:n.batchId})}));const u=[];for(const l of n.mutations){const e=_r(t,l.key.path,n.batchId);s.push(i.delete(e)),u.push(l.key)}return qn.waitFor(s).next(()=>u)}function Iu(e){if(!e)return 0;let t;if(e.document)t=e.document;else if(e.unknownDocument)t=e.unknownDocument;else{if(!e.noDocument)throw Mt(14731);t=e.noDocument}return JSON.stringify(t).length}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */wu.DEFAULT_COLLECTION_PERCENTILE=10,wu.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,wu.DEFAULT=new wu(vu,wu.DEFAULT_COLLECTION_PERCENTILE,wu.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),wu.DISABLED=new wu(-1,0,0);class _u{constructor(e,t,n,r){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=r,this.Zn={}}static yt(e,t,n,r){Vt(""!==e.uid,64387);const i=e.isAuthenticated()?e.uid:"";return new _u(i,t,n,r)}checkEmpty(e){let t=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return Eu(e).X({index:wr,range:n},(e,n,r)=>{t=!1,r.done()}).next(()=>t)}addMutationBatch(e,t,n,r){const i=Su(e),s=Eu(e);return s.add({}).next(o=>{Vt("number"==typeof o,49019);const a=new pa(o,t,n,r),c=function(e,t,n){const r=n.baseMutations.map(t=>ic(e.gt,t)),i=n.mutations.map(t=>ic(e.gt,t));return{userId:t,batchId:n.batchId,localWriteTimeMs:n.localWriteTime.toMillis(),baseMutations:r,mutations:i}}(this.serializer,this.userId,a),u=[];let l=new Ai((e,t)=>en(e.canonicalString(),t.canonicalString()));for(const e of r){const t=_r(this.userId,e.key.path,o);l=l.add(e.key.path.popLast()),u.push(s.put(c)),u.push(i.put(t,Tr))}return l.forEach(t=>{u.push(this.indexManager.addToCollectionParentIndex(e,t))}),e.addOnCommittedListener(()=>{this.Zn[o]=a.keys()}),qn.waitFor(u).next(()=>a)})}lookupMutationBatch(e,t){return Eu(e).get(t).next(e=>e?(Vt(e.userId===this.userId,48,"Unexpected user for mutation batch",{userId:e.userId,batchId:t}),Sc(this.serializer,e)):null)}Xn(e,t){return this.Zn[t]?qn.resolve(this.Zn[t]):this.lookupMutationBatch(e,t).next(e=>{if(e){const n=e.keys();return this.Zn[t]=n,n}return null})}getNextMutationBatchAfterBatchId(e,t){const n=t+1,r=IDBKeyRange.lowerBound([this.userId,n]);let i=null;return Eu(e).X({index:wr,range:r},(e,t,r)=>{t.userId===this.userId&&(Vt(t.batchId>=n,47524,{er:n}),i=Sc(this.serializer,t)),r.done()}).next(()=>i)}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=ir;return Eu(e).X({index:wr,range:t,reverse:!0},(e,t,r)=>{n=t.batchId,r.done()}).next(()=>n)}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,ir],[this.userId,Number.POSITIVE_INFINITY]);return Eu(e).j(wr,t).next(e=>e.map(e=>Sc(this.serializer,e)))}getAllMutationBatchesAffectingDocumentKey(e,t){const n=Ir(this.userId,t.path),r=IDBKeyRange.lowerBound(n),i=[];return Su(e).X({range:r},(n,r,s)=>{const[o,a,c]=n,u=dr(a);if(o===this.userId&&t.path.isEqual(u))return Eu(e).get(c).next(e=>{if(!e)throw Mt(61480,{tr:n,batchId:c});Vt(e.userId===this.userId,10503,"Unexpected user for mutation batch",{userId:e.userId,batchId:c}),i.push(Sc(this.serializer,e))});s.done()}).next(()=>i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new Ai(en);const r=[];return t.forEach(t=>{const i=Ir(this.userId,t.path),s=IDBKeyRange.lowerBound(i),o=Su(e).X({range:s},(e,r,i)=>{const[s,o,a]=e,c=dr(o);s===this.userId&&t.path.isEqual(c)?n=n.add(a):i.done()});r.push(o)}),qn.waitFor(r).next(()=>this.nr(e,n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,r=n.length+1,i=Ir(this.userId,n),s=IDBKeyRange.lowerBound(i);let o=new Ai(en);return Su(e).X({range:s},(e,t,i)=>{const[s,a,c]=e,u=dr(a);s===this.userId&&n.isPrefixOf(u)?u.length===r&&(o=o.add(c)):i.done()}).next(()=>this.nr(e,o))}nr(e,t){const n=[],r=[];return t.forEach(t=>{r.push(Eu(e).get(t).next(e=>{if(null===e)throw Mt(35274,{batchId:t});Vt(e.userId===this.userId,9748,"Unexpected user for mutation batch",{userId:e.userId,batchId:t}),n.push(Sc(this.serializer,e))}))}),qn.waitFor(r).next(()=>n)}removeMutationBatch(e,t){return bu(e.ce,this.userId,t).next(n=>(e.addOnCommittedListener(()=>{this.rr(t.batchId)}),qn.forEach(n,t=>this.referenceDelegate.markPotentiallyOrphaned(e,t))))}rr(e){delete this.Zn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next(t=>{if(!t)return qn.resolve();const n=IDBKeyRange.lowerBound(function(e){return[e]}(this.userId)),r=[];return Su(e).X({range:n},(e,t,n)=>{if(e[0]===this.userId){const t=dr(e[1]);r.push(t)}else n.done()}).next(()=>{Vt(0===r.length,56720,{ir:r.map(e=>e.canonicalString())})})})}containsKey(e,t){return Tu(e,this.userId,t)}sr(e){return Cu(e).get(this.userId).next(e=>e||{userId:this.userId,lastAcknowledgedBatchId:ir,lastStreamToken:""})}}function Tu(e,t,n){const r=Ir(t,n.path),i=r[1],s=IDBKeyRange.lowerBound(r);let o=!1;return Su(e).X({range:s,Z:!0},(e,n,r)=>{const[s,a,c]=e;s===t&&a===i&&(o=!0),r.done()}).next(()=>o)}function Eu(e){return wi(e,yr)}function Su(e){return wi(e,Er)}function Cu(e){return wi(e,gr)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Au{constructor(e){this._r=e}next(){return this._r+=2,this._r}static ar(){return new Au(0)}static ur(){return new Au(-1)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ku{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.cr(e).next(t=>{const n=new Au(t.highestTargetId);return t.highestTargetId=n.next(),this.lr(e,t).next(()=>t.highestTargetId)})}getLastRemoteSnapshotVersion(e){return this.cr(e).next(e=>Cn.fromTimestamp(new Sn(e.lastRemoteSnapshotVersion.seconds,e.lastRemoteSnapshotVersion.nanoseconds)))}getHighestSequenceNumber(e){return this.cr(e).next(e=>e.highestListenSequenceNumber)}setTargetsMetadata(e,t,n){return this.cr(e).next(r=>(r.highestListenSequenceNumber=t,n&&(r.lastRemoteSnapshotVersion=n.toTimestamp()),t>r.highestListenSequenceNumber&&(r.highestListenSequenceNumber=t),this.lr(e,r)))}addTargetData(e,t){return this.hr(e,t).next(()=>this.cr(e).next(n=>(n.targetCount+=1,this.Pr(t,n),this.lr(e,n))))}updateTargetData(e,t){return this.hr(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next(()=>Nu(e).delete(t.targetId)).next(()=>this.cr(e)).next(t=>(Vt(t.targetCount>0,8065),t.targetCount-=1,this.lr(e,t)))}removeTargets(e,t,n){let r=0;const i=[];return Nu(e).X((s,o)=>{const a=Cc(o);a.sequenceNumber<=t&&null===n.get(a.targetId)&&(r++,i.push(this.removeTargetData(e,a)))}).next(()=>qn.waitFor(i)).next(()=>r)}forEachTarget(e,t){return Nu(e).X((e,n)=>{const r=Cc(n);t(r)})}cr(e){return Du(e).get(jr).next(e=>(Vt(null!==e,2888),e))}lr(e,t){return Du(e).put(jr,t)}hr(e,t){return Nu(e).put(Ac(this.serializer,t))}Pr(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.cr(e).next(e=>e.targetCount)}getTargetData(e,t){const n=Xs(t),r=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let i=null;return Nu(e).X({range:r,index:Pr},(e,n,r)=>{const s=Cc(n);Ys(t,s.target)&&(i=s,r.done())}).next(()=>i)}addMatchingKeys(e,t,n){const r=[],i=xu(e);return t.forEach(t=>{const s=ur(t.path);r.push(i.put({targetId:n,path:s})),r.push(this.referenceDelegate.addReference(e,n,t))}),qn.waitFor(r)}removeMatchingKeys(e,t,n){const r=xu(e);return qn.forEach(t,t=>{const i=ur(t.path);return qn.waitFor([r.delete([n,i]),this.referenceDelegate.removeReference(e,n,t)])})}removeMatchingKeysForTargetId(e,t){const n=xu(e),r=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(r)}getMatchingKeysForTargetId(e,t){const n=IDBKeyRange.bound([t],[t+1],!1,!0),r=xu(e);let i=Oo();return r.X({range:n,Z:!0},(e,t,n)=>{const r=dr(e[1]),s=new dn(r);i=i.add(s)}).next(()=>i)}containsKey(e,t){const n=ur(t.path),r=IDBKeyRange.bound([n],[on(n)],!1,!0);let i=0;return xu(e).X({index:Vr,Z:!0,range:r},([e,t],n,r)=>{0!==e&&(i++,r.done())}).next(()=>i>0)}Et(e,t){return Nu(e).get(t).next(e=>e?Cc(e):null)}}function Nu(e){return wi(e,Or)}function Du(e){return wi(e,Br)}function xu(e){return wi(e,Mr)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ru="LruGarbageCollector",Ou=1048576;function Pu([e,t],[n,r]){const i=en(e,n);return 0===i?en(t,r):i}class Lu{constructor(e){this.Tr=e,this.buffer=new Ai(Pu),this.Ir=0}dr(){return++this.Ir}Er(e){const t=[e,this.dr()];if(this.buffer.size<this.Tr)this.buffer=this.buffer.add(t);else{const e=this.buffer.last();Pu(t,e)<0&&(this.buffer=this.buffer.delete(e).add(t))}}get maxValue(){return this.buffer.last()[0]}}class Mu{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.Ar=null}start(){-1!==this.garbageCollector.params.cacheSizeCollectionThreshold&&this.Rr(6e4)}stop(){this.Ar&&(this.Ar.cancel(),this.Ar=null)}get started(){return null!==this.Ar}Rr(e){Rt(Ru,`Garbage collection scheduled in ${e}ms`),this.Ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(e){Qn(e)?Rt(Ru,"Ignoring IndexedDB error during garbage collection: ",e):await Bn(e)}await this.Rr(3e5)})}}class Fu{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.mr(e).next(e=>Math.floor(t/100*e))}nthSequenceNumber(e,t){if(0===t)return qn.resolve(rr.ue);const n=new Lu(t);return this.Vr.forEachTarget(e,e=>n.Er(e.sequenceNumber)).next(()=>this.Vr.gr(e,e=>n.Er(e))).next(()=>n.maxValue)}removeTargets(e,t,n){return this.Vr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return-1===this.params.cacheSizeCollectionThreshold?(Rt("LruGarbageCollector","Garbage collection skipped; disabled"),qn.resolve(yu)):this.getCacheSize(e).next(n=>n<this.params.cacheSizeCollectionThreshold?(Rt("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),yu):this.pr(e,t))}getCacheSize(e){return this.Vr.getCacheSize(e)}pr(e,t){let n,r,i,s,o,a,c;const u=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(t=>(t>this.params.maximumSequenceNumbersToCollect?(Rt("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${t}`),r=this.params.maximumSequenceNumbersToCollect):r=t,s=Date.now(),this.nthSequenceNumber(e,r))).next(r=>(n=r,o=Date.now(),this.removeTargets(e,n,t))).next(t=>(i=t,a=Date.now(),this.removeOrphanedDocuments(e,n))).next(e=>(c=Date.now(),xt()<=z.DEBUG&&Rt("LruGarbageCollector",`LRU Garbage Collection\n\tCounted targets in ${s-u}ms\n\tDetermined least recently used ${r} in `+(o-s)+`ms\n\tRemoved ${i} targets in `+(a-o)+`ms\n\tRemoved ${e} documents in `+(c-a)+`ms\nTotal Duration: ${c-u}ms`),qn.resolve({didRun:!0,sequenceNumbersCollected:r,targetsRemoved:i,documentsRemoved:e})))}}function Vu(e,t){return new Fu(e,t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uu{constructor(e,t){this.db=e,this.garbageCollector=Vu(this,t)}mr(e){const t=this.yr(e);return this.db.getTargetCache().getTargetCount(e).next(e=>t.next(t=>e+t))}yr(e){let t=0;return this.gr(e,e=>{t++}).next(()=>t)}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}gr(e,t){return this.wr(e,(e,n)=>t(n))}addReference(e,t,n){return ju(e,n)}removeReference(e,t,n){return ju(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return ju(e,t)}Sr(e,t){return function(e,t){let n=!1;return Cu(e).ee(r=>Tu(e,r,t).next(e=>(e&&(n=!0),qn.resolve(!e)))).next(()=>n)}(e,t)}removeOrphanedDocuments(e,t){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),r=[];let i=0;return this.wr(e,(s,o)=>{if(o<=t){const t=this.Sr(e,s).next(t=>{if(!t)return i++,n.getEntry(e,s).next(()=>(n.removeEntry(s,Cn.min()),xu(e).delete([0,ur(s.path)])))});r.push(t)}}).next(()=>qn.waitFor(r)).next(()=>n.apply(e)).next(()=>i)}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return ju(e,t)}wr(e,t){const n=xu(e);let r,i=rr.ue;return n.X({index:Vr},([e,n],{path:s,sequenceNumber:o})=>{0===e?(i!==rr.ue&&t(new dn(dr(r)),i),i=o,r=s):i=rr.ue}).next(()=>{i!==rr.ue&&t(new dn(dr(r)),i)})}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function ju(e,t){return xu(e).put((n=t,r=e.currentSequenceNumber,{targetId:0,path:ur(n.path),sequenceNumber:r}));var n,r}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bu{constructor(){this.changes=new _o(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Es.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return void 0!==n?qn.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qu{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return Gu(e).put(n)}removeEntry(e,t,n){return Gu(e).delete(function(e,t){const n=e.path.toArray();return[n.slice(0,n.length-2),n[n.length-2],_c(t),n[n.length-1]]}(t,n))}updateMetadata(e,t){return this.getMetadata(e).next(n=>(n.byteSize+=t,this.br(e,n)))}getEntry(e,t){let n=Es.newInvalidDocument(t);return Gu(e).X({index:Ar,range:IDBKeyRange.only(Hu(t))},(e,r)=>{n=this.Dr(t,r)}).next(()=>n)}vr(e,t){let n={size:0,document:Es.newInvalidDocument(t)};return Gu(e).X({index:Ar,range:IDBKeyRange.only(Hu(t))},(e,r)=>{n={document:this.Dr(t,r),size:Iu(r)}}).next(()=>n)}getEntries(e,t){let n=Eo();return this.Cr(e,t,(e,t)=>{const r=this.Dr(e,t);n=n.insert(e,r)}).next(()=>n)}Fr(e,t){let n=Eo(),r=new Ei(dn.comparator);return this.Cr(e,t,(e,t)=>{const i=this.Dr(e,t);n=n.insert(e,i),r=r.insert(e,Iu(t))}).next(()=>({documents:n,Mr:r}))}Cr(e,t,n){if(t.isEmpty())return qn.resolve();let r=new Ai(Qu);t.forEach(e=>r=r.add(e));const i=IDBKeyRange.bound(Hu(r.first()),Hu(r.last())),s=r.getIterator();let o=s.getNext();return Gu(e).X({index:Ar,range:i},(e,t,r)=>{const i=dn.fromSegments([...t.prefixPath,t.collectionGroup,t.documentId]);for(;o&&Qu(o,i)<0;)n(o,null),o=s.getNext();o&&o.isEqual(i)&&(n(o,t),o=s.hasNext()?s.getNext():null),o?r.G(Hu(o)):r.done()}).next(()=>{for(;o;)n(o,null),o=s.hasNext()?s.getNext():null})}getDocumentsMatchingQuery(e,t,n,r,i){const s=t.path,o=[s.popLast().toArray(),s.lastSegment(),_c(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],a=[s.popLast().toArray(),s.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return Gu(e).j(IDBKeyRange.bound(o,a,!0)).next(e=>{null==i||i.incrementDocumentReadCount(e.length);let n=Eo();for(const i of e){const e=this.Dr(dn.fromSegments(i.prefixPath.concat(i.collectionGroup,i.documentId)),i);e.isFoundDocument()&&(vo(t,e)||r.has(e.key))&&(n=n.insert(e.key,e))}return n})}getAllFromCollectionGroup(e,t,n,r){let i=Eo();const s=Wu(t,n),o=Wu(t,Fn.max());return Gu(e).X({index:Nr,range:IDBKeyRange.bound(s,o,!0)},(e,t,n)=>{const s=this.Dr(dn.fromSegments(t.prefixPath.concat(t.collectionGroup,t.documentId)),t);i=i.insert(s.key,s),i.size===r&&n.done()}).next(()=>i)}newChangeBuffer(e){return new $u(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next(e=>e.byteSize)}getMetadata(e){return Ku(e).get(Rr).next(e=>(Vt(!!e,20021),e))}br(e,t){return Ku(e).put(Rr,t)}Dr(e,t){if(t){const e=function(e,t){let n;if(t.document)n=rc(e.gt,t.document,!!t.hasCommittedMutations);else if(t.noDocument){const e=dn.fromSegments(t.noDocument.path),r=Ec(t.noDocument.readTime);n=Es.newNoDocument(e,r),t.hasCommittedMutations&&n.setHasCommittedMutations()}else{if(!t.unknownDocument)return Mt(56709);{const e=dn.fromSegments(t.unknownDocument.path),r=Ec(t.unknownDocument.version);n=Es.newUnknownDocument(e,r)}}return t.readTime&&n.setReadTime(function(e){const t=new Sn(e[0],e[1]);return Cn.fromTimestamp(t)}(t.readTime)),n}(this.serializer,t);if(!e.isNoDocument()||!e.version.isEqual(Cn.min()))return e}return Es.newInvalidDocument(e)}}function zu(e){return new qu(e)}class $u extends Bu{constructor(e,t){super(),this.Or=e,this.trackRemovals=t,this.Nr=new _o(e=>e.toString(),(e,t)=>e.isEqual(t))}applyChanges(e){const t=[];let n=0,r=new Ai((e,t)=>en(e.canonicalString(),t.canonicalString()));return this.changes.forEach((i,s)=>{const o=this.Nr.get(i);if(t.push(this.Or.removeEntry(e,i,o.readTime)),s.isValidDocument()){const a=Ic(this.Or.serializer,s);r=r.add(i.path.popLast());const c=Iu(a);n+=c-o.size,t.push(this.Or.addEntry(e,i,a))}else if(n-=o.size,this.trackRemovals){const n=Ic(this.Or.serializer,s.convertToNoDocument(Cn.min()));t.push(this.Or.addEntry(e,i,n))}}),r.forEach(n=>{t.push(this.Or.indexManager.addToCollectionParentIndex(e,n))}),t.push(this.Or.updateMetadata(e,n)),qn.waitFor(t)}getFromCache(e,t){return this.Or.vr(e,t).next(e=>(this.Nr.set(t,{size:e.size,readTime:e.document.readTime}),e.document))}getAllFromCache(e,t){return this.Or.Fr(e,t).next(({documents:e,Mr:t})=>(t.forEach((t,n)=>{this.Nr.set(t,{size:n,readTime:e.get(t).readTime})}),e))}}function Ku(e){return wi(e,xr)}function Gu(e){return wi(e,Sr)}function Hu(e){const t=e.path.toArray();return[t.slice(0,t.length-2),t[t.length-2],t[t.length-1]]}function Wu(e,t){const n=t.documentKey.path.toArray();return[e,_c(t.readTime),n.slice(0,n.length-2),n.length>0?n[n.length-1]:""]}function Qu(e,t){const n=e.path.toArray(),r=t.path.toArray();let i=0;for(let s=0;s<n.length-2&&s<r.length-2;++s)if(i=en(n[s],r[s]),i)return i;return i=en(n.length,r.length),i||(i=en(n[n.length-2],r[r.length-2]),i||en(n[n.length-1],r[r.length-1])
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */)}class Ju{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xu{constructor(e,t,n,r){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=r}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next(r=>(n=r,this.remoteDocumentCache.getEntry(e,t))).next(e=>(null!==n&&ia(n.mutation,e,Di.empty(),Sn.now()),e))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(t=>this.getLocalViewOfDocuments(e,t,Oo()).next(()=>t))}getLocalViewOfDocuments(e,t,n=Oo()){const r=ko();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,n).next(e=>{let t=Co();return e.forEach((e,n)=>{t=t.insert(e,n.overlayedDocument)}),t}))}getOverlayedDocuments(e,t){const n=ko();return this.populateOverlays(e,n,t).next(()=>this.computeViews(e,t,n,Oo()))}populateOverlays(e,t,n){const r=[];return n.forEach(e=>{t.has(e)||r.push(e)}),this.documentOverlayCache.getOverlays(e,r).next(e=>{e.forEach((e,n)=>{t.set(e,n)})})}computeViews(e,t,n,r){let i=Eo();const s=Do(),o=Do();return t.forEach((e,t)=>{const o=n.get(t.key);r.has(t.key)&&(void 0===o||o.mutation instanceof ca)?i=i.insert(t.key,t):void 0!==o?(s.set(t.key,o.mutation.getFieldMask()),ia(o.mutation,t,o.mutation.getFieldMask(),Sn.now())):s.set(t.key,Di.empty())}),this.recalculateAndSaveOverlays(e,i).next(e=>(e.forEach((e,t)=>s.set(e,t)),t.forEach((e,t)=>{var n;return o.set(e,new Ju(t,null!==(n=s.get(e))&&void 0!==n?n:null))}),o))}recalculateAndSaveOverlays(e,t){const n=Do();let r=new Ei((e,t)=>e-t),i=Oo();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(e=>{for(const i of e)i.keys().forEach(e=>{const s=t.get(e);if(null===s)return;let o=n.get(e)||Di.empty();o=i.applyToLocalView(s,o),n.set(e,o);const a=(r.get(i.batchId)||Oo()).add(e);r=r.insert(i.batchId,a)})}).next(()=>{const s=[],o=r.getReverseIterator();for(;o.hasNext();){const r=o.getNext(),a=r.key,c=r.value,u=No();c.forEach(e=>{if(!i.has(e)){const r=na(t.get(e),n.get(e));null!==r&&u.set(e,r),i=i.add(e)}}),s.push(this.documentOverlayCache.saveOverlays(e,a,u))}return qn.waitFor(s)}).next(()=>n)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(t=>this.recalculateAndSaveOverlays(e,t))}getDocumentsMatchingQuery(e,t,n,r){return i=t,dn.isDocumentKey(i.path)&&null===i.collectionGroup&&0===i.filters.length?this.getDocumentsMatchingDocumentQuery(e,t.path):ao(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,r):this.getDocumentsMatchingCollectionQuery(e,t,n,r);var i}getNextDocuments(e,t,n,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,r).next(i=>{const s=r-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,r-i.size):qn.resolve(ko());let o=An,a=i;return s.next(t=>qn.forEach(t,(t,n)=>(o<n.largestBatchId&&(o=n.largestBatchId),i.get(t)?qn.resolve():this.remoteDocumentCache.getEntry(e,t).next(e=>{a=a.insert(t,e)}))).next(()=>this.populateOverlays(e,t,i)).next(()=>this.computeViews(e,a,t,Oo())).next(e=>({batchId:o,changes:Ao(e)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new dn(t)).next(e=>{let t=Co();return e.isFoundDocument()&&(t=t.insert(e.key,e)),t})}getDocumentsMatchingCollectionGroupQuery(e,t,n,r){const i=t.collectionGroup;let s=Co();return this.indexManager.getCollectionParents(e,i).next(o=>qn.forEach(o,o=>{const a=(c=t,u=o.child(i),new ro(u,null,c.explicitOrderBy.slice(),c.filters.slice(),c.limit,c.limitType,c.startAt,c.endAt));var c,u;return this.getDocumentsMatchingCollectionQuery(e,a,n,r).next(e=>{e.forEach((e,t)=>{s=s.insert(e,t)})})}).next(()=>s))}getDocumentsMatchingCollectionQuery(e,t,n,r){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next(s=>(i=s,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,r))).next(e=>{i.forEach((t,n)=>{const r=n.getKey();null===e.get(r)&&(e=e.insert(r,Es.newInvalidDocument(r)))});let n=Co();return e.forEach((e,r)=>{const s=i.get(e);void 0!==s&&ia(s.mutation,r,Di.empty(),Sn.now()),vo(t,r)&&(n=n.insert(e,r))}),n})}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yu{constructor(e){this.serializer=e,this.Br=new Map,this.Lr=new Map}getBundleMetadata(e,t){return qn.resolve(this.Br.get(t))}saveBundleMetadata(e,t){return this.Br.set(t.id,{id:(n=t).id,version:n.version,createTime:Ga(n.createTime)}),qn.resolve();var n}getNamedQuery(e,t){return qn.resolve(this.Lr.get(t))}saveNamedQuery(e,t){return this.Lr.set(t.name,{name:(n=t).name,query:kc(n.bundledQuery),readTime:Ga(n.readTime)}),qn.resolve();var n}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zu{constructor(){this.overlays=new Ei(dn.comparator),this.kr=new Map}getOverlay(e,t){return qn.resolve(this.overlays.get(t))}getOverlays(e,t){const n=ko();return qn.forEach(t,t=>this.getOverlay(e,t).next(e=>{null!==e&&n.set(t,e)})).next(()=>n)}saveOverlays(e,t,n){return n.forEach((n,r)=>{this.wt(e,t,r)}),qn.resolve()}removeOverlaysForBatchId(e,t,n){const r=this.kr.get(n);return void 0!==r&&(r.forEach(e=>this.overlays=this.overlays.remove(e)),this.kr.delete(n)),qn.resolve()}getOverlaysForCollection(e,t,n){const r=ko(),i=t.length+1,s=new dn(t.child("")),o=this.overlays.getIteratorFrom(s);for(;o.hasNext();){const e=o.getNext().value,s=e.getKey();if(!t.isPrefixOf(s.path))break;s.path.length===i&&e.largestBatchId>n&&r.set(e.getKey(),e)}return qn.resolve(r)}getOverlaysForCollectionGroup(e,t,n,r){let i=new Ei((e,t)=>e-t);const s=this.overlays.getIterator();for(;s.hasNext();){const e=s.getNext().value;if(e.getKey().getCollectionGroup()===t&&e.largestBatchId>n){let t=i.get(e.largestBatchId);null===t&&(t=ko(),i=i.insert(e.largestBatchId,t)),t.set(e.getKey(),e)}}const o=ko(),a=i.getIterator();for(;a.hasNext()&&(a.getNext().value.forEach((e,t)=>o.set(e,t)),!(o.size()>=r)););return qn.resolve(o)}wt(e,t,n){const r=this.overlays.get(n.key);if(null!==r){const e=this.kr.get(r.largestBatchId).delete(n.key);this.kr.set(r.largestBatchId,e)}this.overlays=this.overlays.insert(n.key,new ga(t,n));let i=this.kr.get(t);void 0===i&&(i=Oo(),this.kr.set(t,i)),this.kr.set(t,i.add(n.key))}}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class el{constructor(){this.sessionToken=Ri.EMPTY_BYTE_STRING}getSessionToken(e){return qn.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,qn.resolve()}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tl{constructor(){this.qr=new Ai(nl.Qr),this.$r=new Ai(nl.Ur)}isEmpty(){return this.qr.isEmpty()}addReference(e,t){const n=new nl(e,t);this.qr=this.qr.add(n),this.$r=this.$r.add(n)}Kr(e,t){e.forEach(e=>this.addReference(e,t))}removeReference(e,t){this.Wr(new nl(e,t))}Gr(e,t){e.forEach(e=>this.removeReference(e,t))}zr(e){const t=new dn(new un([])),n=new nl(t,e),r=new nl(t,e+1),i=[];return this.$r.forEachInRange([n,r],e=>{this.Wr(e),i.push(e.key)}),i}jr(){this.qr.forEach(e=>this.Wr(e))}Wr(e){this.qr=this.qr.delete(e),this.$r=this.$r.delete(e)}Jr(e){const t=new dn(new un([])),n=new nl(t,e),r=new nl(t,e+1);let i=Oo();return this.$r.forEachInRange([n,r],e=>{i=i.add(e.key)}),i}containsKey(e){const t=new nl(e,0),n=this.qr.firstAfterOrEqual(t);return null!==n&&e.isEqual(n.key)}}class nl{constructor(e,t){this.key=e,this.Hr=t}static Qr(e,t){return dn.comparator(e.key,t.key)||en(e.Hr,t.Hr)}static Ur(e,t){return en(e.Hr,t.Hr)||dn.comparator(e.key,t.key)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rl{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.er=1,this.Yr=new Ai(nl.Qr)}checkEmpty(e){return qn.resolve(0===this.mutationQueue.length)}addMutationBatch(e,t,n,r){const i=this.er;this.er++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const s=new pa(i,t,n,r);this.mutationQueue.push(s);for(const o of r)this.Yr=this.Yr.add(new nl(o.key,i)),this.indexManager.addToCollectionParentIndex(e,o.key.path.popLast());return qn.resolve(s)}lookupMutationBatch(e,t){return qn.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,r=this.Xr(n),i=r<0?0:r;return qn.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return qn.resolve(0===this.mutationQueue.length?ir:this.er-1)}getAllMutationBatches(e){return qn.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new nl(t,0),r=new nl(t,Number.POSITIVE_INFINITY),i=[];return this.Yr.forEachInRange([n,r],e=>{const t=this.Zr(e.Hr);i.push(t)}),qn.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new Ai(en);return t.forEach(e=>{const t=new nl(e,0),r=new nl(e,Number.POSITIVE_INFINITY);this.Yr.forEachInRange([t,r],e=>{n=n.add(e.Hr)})}),qn.resolve(this.ei(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,r=n.length+1;let i=n;dn.isDocumentKey(i)||(i=i.child(""));const s=new nl(new dn(i),0);let o=new Ai(en);return this.Yr.forEachWhile(e=>{const t=e.key.path;return!!n.isPrefixOf(t)&&(t.length===r&&(o=o.add(e.Hr)),!0)},s),qn.resolve(this.ei(o))}ei(e){const t=[];return e.forEach(e=>{const n=this.Zr(e);null!==n&&t.push(n)}),t}removeMutationBatch(e,t){Vt(0===this.ti(t.batchId,"removed"),55003),this.mutationQueue.shift();let n=this.Yr;return qn.forEach(t.mutations,r=>{const i=new nl(r.key,t.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)}).next(()=>{this.Yr=n})}rr(e){}containsKey(e,t){const n=new nl(t,0),r=this.Yr.firstAfterOrEqual(n);return qn.resolve(t.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,qn.resolve()}ti(e,t){return this.Xr(e)}Xr(e){return 0===this.mutationQueue.length?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class il{constructor(e){this.ni=e,this.docs=new Ei(dn.comparator),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,r=this.docs.get(n),i=r?r.size:0,s=this.ni(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:s}),this.size+=s-i,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return qn.resolve(n?n.document.mutableCopy():Es.newInvalidDocument(t))}getEntries(e,t){let n=Eo();return t.forEach(e=>{const t=this.docs.get(e);n=n.insert(e,t?t.document.mutableCopy():Es.newInvalidDocument(e))}),qn.resolve(n)}getDocumentsMatchingQuery(e,t,n,r){let i=Eo();const s=t.path,o=new dn(s.child("__id-9223372036854775808__")),a=this.docs.getIteratorFrom(o);for(;a.hasNext();){const{key:e,value:{document:o}}=a.getNext();if(!s.isPrefixOf(e.path))break;e.path.length>s.length+1||Vn(Mn(o),n)<=0||(r.has(o.key)||vo(t,o))&&(i=i.insert(o.key,o.mutableCopy()))}return qn.resolve(i)}getAllFromCollectionGroup(e,t,n,r){Mt(9500)}ri(e,t){return qn.forEach(this.docs,e=>t(e))}newChangeBuffer(e){return new sl(this)}getSize(e){return qn.resolve(this.size)}}class sl extends Bu{constructor(e){super(),this.Or=e}applyChanges(e){const t=[];return this.changes.forEach((n,r)=>{r.isValidDocument()?t.push(this.Or.addEntry(e,r)):this.Or.removeEntry(n)}),qn.waitFor(t)}getFromCache(e,t){return this.Or.getEntry(e,t)}getAllFromCache(e,t){return this.Or.getEntries(e,t)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ol{constructor(e){this.persistence=e,this.ii=new _o(e=>Xs(e),Ys),this.lastRemoteSnapshotVersion=Cn.min(),this.highestTargetId=0,this.si=0,this.oi=new tl,this.targetCount=0,this._i=Au.ar()}forEachTarget(e,t){return this.ii.forEach((e,n)=>t(n)),qn.resolve()}getLastRemoteSnapshotVersion(e){return qn.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return qn.resolve(this.si)}allocateTargetId(e){return this.highestTargetId=this._i.next(),qn.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.si&&(this.si=t),qn.resolve()}hr(e){this.ii.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this._i=new Au(t),this.highestTargetId=t),e.sequenceNumber>this.si&&(this.si=e.sequenceNumber)}addTargetData(e,t){return this.hr(t),this.targetCount+=1,qn.resolve()}updateTargetData(e,t){return this.hr(t),qn.resolve()}removeTargetData(e,t){return this.ii.delete(t.target),this.oi.zr(t.targetId),this.targetCount-=1,qn.resolve()}removeTargets(e,t,n){let r=0;const i=[];return this.ii.forEach((s,o)=>{o.sequenceNumber<=t&&null===n.get(o.targetId)&&(this.ii.delete(s),i.push(this.removeMatchingKeysForTargetId(e,o.targetId)),r++)}),qn.waitFor(i).next(()=>r)}getTargetCount(e){return qn.resolve(this.targetCount)}getTargetData(e,t){const n=this.ii.get(t)||null;return qn.resolve(n)}addMatchingKeys(e,t,n){return this.oi.Kr(t,n),qn.resolve()}removeMatchingKeys(e,t,n){this.oi.Gr(t,n);const r=this.persistence.referenceDelegate,i=[];return r&&t.forEach(t=>{i.push(r.markPotentiallyOrphaned(e,t))}),qn.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.oi.zr(t),qn.resolve()}getMatchingKeysForTargetId(e,t){const n=this.oi.Jr(t);return qn.resolve(n)}containsKey(e,t){return qn.resolve(this.oi.containsKey(t))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class al{constructor(e,t){this.ai={},this.overlays={},this.ui=new rr(0),this.ci=!1,this.ci=!0,this.li=new el,this.referenceDelegate=e(this),this.hi=new ol(this),this.indexManager=new au,this.remoteDocumentCache=new il(e=>this.referenceDelegate.Pi(e)),this.serializer=new bc(t),this.Ti=new Yu(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ci=!1,Promise.resolve()}get started(){return this.ci}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Zu,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.ai[e.toKey()];return n||(n=new rl(t,this.referenceDelegate),this.ai[e.toKey()]=n),n}getGlobalsCache(){return this.li}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ti}runTransaction(e,t,n){Rt("MemoryPersistence","Starting transaction:",e);const r=new cl(this.ui.next());return this.referenceDelegate.Ii(),n(r).next(e=>this.referenceDelegate.di(r).next(()=>e)).toPromise().then(e=>(r.raiseOnCommittedEvent(),e))}Ei(e,t){return qn.or(Object.values(this.ai).map(n=>()=>n.containsKey(e,t)))}}class cl extends jn{constructor(e){super(),this.currentSequenceNumber=e}}class ul{constructor(e){this.persistence=e,this.Ai=new tl,this.Ri=null}static Vi(e){return new ul(e)}get mi(){if(this.Ri)return this.Ri;throw Mt(60996)}addReference(e,t,n){return this.Ai.addReference(n,t),this.mi.delete(n.toString()),qn.resolve()}removeReference(e,t,n){return this.Ai.removeReference(n,t),this.mi.add(n.toString()),qn.resolve()}markPotentiallyOrphaned(e,t){return this.mi.add(t.toString()),qn.resolve()}removeTarget(e,t){this.Ai.zr(t.targetId).forEach(e=>this.mi.add(e.toString()));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next(e=>{e.forEach(e=>this.mi.add(e.toString()))}).next(()=>n.removeTargetData(e,t))}Ii(){this.Ri=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return qn.forEach(this.mi,n=>{const r=dn.fromPath(n);return this.fi(e,r).next(e=>{e||t.removeEntry(r,Cn.min())})}).next(()=>(this.Ri=null,t.apply(e)))}updateLimboDocument(e,t){return this.fi(e,t).next(e=>{e?this.mi.delete(t.toString()):this.mi.add(t.toString())})}Pi(e){return 0}fi(e,t){return qn.or([()=>qn.resolve(this.Ai.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class ll{constructor(e,t){this.persistence=e,this.gi=new _o(e=>ur(e.path),(e,t)=>e.isEqual(t)),this.garbageCollector=Vu(this,t)}static Vi(e,t){return new ll(e,t)}Ii(){}di(e){return qn.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}mr(e){const t=this.yr(e);return this.persistence.getTargetCache().getTargetCount(e).next(e=>t.next(t=>e+t))}yr(e){let t=0;return this.gr(e,e=>{t++}).next(()=>t)}gr(e,t){return qn.forEach(this.gi,(n,r)=>this.Sr(e,n,r).next(e=>e?qn.resolve():t(r)))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const r=this.persistence.getRemoteDocumentCache(),i=r.newChangeBuffer();return r.ri(e,r=>this.Sr(e,r,t).next(e=>{e||(n++,i.removeEntry(r,Cn.min()))})).next(()=>i.apply(e)).next(()=>n)}markPotentiallyOrphaned(e,t){return this.gi.set(t,e.currentSequenceNumber),qn.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.gi.set(n,e.currentSequenceNumber),qn.resolve()}removeReference(e,t,n){return this.gi.set(n,e.currentSequenceNumber),qn.resolve()}updateLimboDocument(e,t){return this.gi.set(t,e.currentSequenceNumber),qn.resolve()}Pi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=as(e.data.value)),t}Sr(e,t,n){return qn.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const e=this.gi.get(t);return qn.resolve(void 0!==e&&e>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hl{constructor(e){this.serializer=e}q(e,t,n,r){const i=new $n("createOrUpgrade",t);n<1&&r>=1&&(e.createObjectStore(pr),function(e){e.createObjectStore(gr,{keyPath:"userId"});e.createObjectStore(yr,{keyPath:vr,autoIncrement:!0}).createIndex(wr,br,{unique:!0}),e.createObjectStore(Er)}(e),dl(e),function(e){e.createObjectStore(fr)}(e));let s=qn.resolve();return n<3&&r>=3&&(0!==n&&(function(e){e.deleteObjectStore(Mr),e.deleteObjectStore(Or),e.deleteObjectStore(Br)}(e),dl(e)),s=s.next(()=>function(e){const t=e.store(Br),n={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:Cn.min().toTimestamp(),targetCount:0};return t.put(jr,n)}(i))),n<4&&r>=4&&(0!==n&&(s=s.next(()=>function(e,t){return t.store(yr).j().next(n=>{e.deleteObjectStore(yr),e.createObjectStore(yr,{keyPath:vr,autoIncrement:!0}).createIndex(wr,br,{unique:!0});const r=t.store(yr),i=n.map(e=>r.put(e));return qn.waitFor(i)})}(e,i))),s=s.next(()=>{!function(e){e.createObjectStore($r,{keyPath:"clientId"})}(e)})),n<5&&r>=5&&(s=s.next(()=>this.pi(i))),n<6&&r>=6&&(s=s.next(()=>(function(e){e.createObjectStore(xr)}(e),this.yi(i)))),n<7&&r>=7&&(s=s.next(()=>this.wi(i))),n<8&&r>=8&&(s=s.next(()=>this.Si(e,i))),n<9&&r>=9&&(s=s.next(()=>{!function(e){e.objectStoreNames.contains("remoteDocumentChanges")&&e.deleteObjectStore("remoteDocumentChanges")}(e)})),n<10&&r>=10&&(s=s.next(()=>this.bi(i))),n<11&&r>=11&&(s=s.next(()=>{!function(e){e.createObjectStore(Kr,{keyPath:"bundleId"})}(e),function(e){e.createObjectStore(Gr,{keyPath:"name"})}(e)})),n<12&&r>=12&&(s=s.next(()=>{!function(e){const t=e.createObjectStore(ri,{keyPath:ii});t.createIndex(si,oi,{unique:!1}),t.createIndex(ai,ci,{unique:!1})}(e)})),n<13&&r>=13&&(s=s.next(()=>function(e){const t=e.createObjectStore(Sr,{keyPath:Cr});t.createIndex(Ar,kr),t.createIndex(Nr,Dr)}(e)).next(()=>this.Di(e,i)).next(()=>e.deleteObjectStore(fr))),n<14&&r>=14&&(s=s.next(()=>this.Ci(e,i))),n<15&&r>=15&&(s=s.next(()=>function(e){e.createObjectStore(Hr,{keyPath:"indexId",autoIncrement:!0}).createIndex(Wr,"collectionGroup",{unique:!1});e.createObjectStore(Qr,{keyPath:Jr}).createIndex(Xr,Yr,{unique:!1});e.createObjectStore(Zr,{keyPath:ei}).createIndex(ti,ni,{unique:!1})}(e))),n<16&&r>=16&&(s=s.next(()=>{t.objectStore(Qr).clear()}).next(()=>{t.objectStore(Zr).clear()})),n<17&&r>=17&&(s=s.next(()=>{!function(e){e.createObjectStore(ui,{keyPath:"name"})}(e)})),n<18&&r>=18&&T()&&(s=s.next(()=>{t.objectStore(Qr).clear()}).next(()=>{t.objectStore(Zr).clear()})),s}yi(e){let t=0;return e.store(fr).X((e,n)=>{t+=Iu(n)}).next(()=>{const n={byteSize:t};return e.store(xr).put(Rr,n)})}pi(e){const t=e.store(gr),n=e.store(yr);return t.j().next(t=>qn.forEach(t,t=>{const r=IDBKeyRange.bound([t.userId,ir],[t.userId,t.lastAcknowledgedBatchId]);return n.j(wr,r).next(n=>qn.forEach(n,n=>{Vt(n.userId===t.userId,18650,"Cannot process batch from unexpected user",{batchId:n.batchId});const r=Sc(this.serializer,n);return bu(e,t.userId,r).next(()=>{})}))}))}wi(e){const t=e.store(Mr),n=e.store(fr);return e.store(Br).get(jr).next(e=>{const r=[];return n.X((n,i)=>{const s=new un(n),o=[0,ur(s)];r.push(t.get(o).next(n=>{return n?qn.resolve():(r=s,t.put({targetId:0,path:ur(r),sequenceNumber:e.highestListenSequenceNumber}));var r}))}).next(()=>qn.waitFor(r))})}Si(e,t){e.createObjectStore(qr,{keyPath:zr});const n=t.store(qr),r=new cu,i=e=>{if(r.add(e)){const t=e.lastSegment(),r=e.popLast();return n.put({collectionId:t,parent:ur(r)})}};return t.store(fr).X({Z:!0},(e,t)=>{const n=new un(e);return i(n.popLast())}).next(()=>t.store(Er).X({Z:!0},([e,t,n],r)=>{const s=dr(t);return i(s.popLast())}))}bi(e){const t=e.store(Or);return t.X((e,n)=>{const r=Cc(n),i=Ac(this.serializer,r);return t.put(i)})}Di(e,t){const n=t.store(fr),r=[];return n.X((e,n)=>{const i=t.store(Sr),s=(a=n,a.document?new dn(un.fromString(a.document.name).popFirst(5)):a.noDocument?dn.fromSegments(a.noDocument.path):a.unknownDocument?dn.fromSegments(a.unknownDocument.path):Mt(36783)).path.toArray(),o={prefixPath:s.slice(0,s.length-2),collectionGroup:s[s.length-2],documentId:s[s.length-1],readTime:n.readTime||[0,0],unknownDocument:n.unknownDocument,noDocument:n.noDocument,document:n.document,hasCommittedMutations:!!n.hasCommittedMutations};var a;r.push(i.put(o))}).next(()=>qn.waitFor(r))}Ci(e,t){const n=t.store(yr),r=zu(this.serializer),i=new al(ul.Vi,this.serializer.gt);return n.j().next(e=>{const n=new Map;return e.forEach(e=>{var t;let r=null!==(t=n.get(e.userId))&&void 0!==t?t:Oo();Sc(this.serializer,e).keys().forEach(e=>r=r.add(e)),n.set(e.userId,r)}),qn.forEach(n,(e,n)=>{const s=new kt(n),o=Lc.yt(this.serializer,s),a=i.getIndexManager(s),c=_u.yt(s,this.serializer,a,i.referenceDelegate);return new Xu(r,c,o,a).recalculateAndSaveOverlaysForDocumentKeys(new vi(t,rr.ue),e).next()})})}}function dl(e){e.createObjectStore(Mr,{keyPath:Fr}).createIndex(Vr,Ur,{unique:!0}),e.createObjectStore(Or,{keyPath:"targetId"}).createIndex(Pr,Lr,{unique:!0}),e.createObjectStore(Br)}const fl="IndexedDbPersistence",pl=18e5,ml=5e3,gl="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",yl="main";class vl{constructor(e,t,n,r,i,s,o,a,c,u,l=18){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=n,this.Fi=i,this.window=s,this.document=o,this.Mi=c,this.xi=u,this.Oi=l,this.ui=null,this.ci=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Ni=null,this.inForeground=!1,this.Bi=null,this.Li=null,this.ki=Number.NEGATIVE_INFINITY,this.qi=e=>Promise.resolve(),!vl.C())throw new Bt(jt.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new Uu(this,r),this.Qi=t+yl,this.serializer=new bc(a),this.$i=new Kn(this.Qi,this.Oi,new hl(this.serializer)),this.li=new Fc,this.hi=new ku(this.referenceDelegate,this.serializer),this.remoteDocumentCache=zu(this.serializer),this.Ti=new Rc,this.window&&this.window.localStorage?this.Ui=this.window.localStorage:(this.Ui=null,!1===u&&Ot(fl,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.Ki().then(()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new Bt(jt.FAILED_PRECONDITION,gl);return this.Wi(),this.Gi(),this.zi(),this.runTransaction("getHighestListenSequenceNumber","readonly",e=>this.hi.getHighestSequenceNumber(e))}).then(e=>{this.ui=new rr(e,this.Mi)}).then(()=>{this.ci=!0}).catch(e=>(this.$i&&this.$i.close(),Promise.reject(e)))}ji(e){return this.qi=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.$i.setDatabaseDeletedListener(e)}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.Fi.enqueueAndForget(async()=>{this.started&&await this.Ki()}))}Ki(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",e=>bl(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next(()=>{if(this.isPrimary)return this.Ji(e).next(e=>{e||(this.isPrimary=!1,this.Fi.enqueueRetryable(()=>this.qi(!1)))})}).next(()=>this.Hi(e)).next(t=>this.isPrimary&&!t?this.Yi(e).next(()=>!1):!!t&&this.Zi(e).next(()=>!0))).catch(e=>{if(Qn(e))return Rt(fl,"Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return Rt(fl,"Releasing owner lease after error during lease refresh",e),!1}).then(e=>{this.isPrimary!==e&&this.Fi.enqueueRetryable(()=>this.qi(e)),this.isPrimary=e})}Ji(e){return wl(e).get(mr).next(e=>qn.resolve(this.Xi(e)))}es(e){return bl(e).delete(this.clientId)}async ts(){if(this.isPrimary&&!this.ns(this.ki,pl)){this.ki=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",e=>{const t=wi(e,$r);return t.j().next(e=>{const n=this.rs(e,pl),r=e.filter(e=>-1===n.indexOf(e));return qn.forEach(r,e=>t.delete(e.clientId)).next(()=>r)})}).catch(()=>[]);if(this.Ui)for(const t of e)this.Ui.removeItem(this.ss(t.clientId))}}zi(){this.Li=this.Fi.enqueueAfterDelay("client_metadata_refresh",4e3,()=>this.Ki().then(()=>this.ts()).then(()=>this.zi()))}Xi(e){return!!e&&e.ownerId===this.clientId}Hi(e){return this.xi?qn.resolve(!0):wl(e).get(mr).next(t=>{if(null!==t&&this.ns(t.leaseTimestampMs,ml)&&!this._s(t.ownerId)){if(this.Xi(t)&&this.networkEnabled)return!0;if(!this.Xi(t)){if(!t.allowTabSynchronization)throw new Bt(jt.FAILED_PRECONDITION,gl);return!1}}return!(!this.networkEnabled||!this.inForeground)||bl(e).j().next(e=>void 0===this.rs(e,ml).find(e=>{if(this.clientId!==e.clientId){const t=!this.networkEnabled&&e.networkEnabled,n=!this.inForeground&&e.inForeground,r=this.networkEnabled===e.networkEnabled;if(t||n&&r)return!0}return!1}))}).next(e=>(this.isPrimary!==e&&Rt(fl,`Client ${e?"is":"is not"} eligible for a primary lease.`),e))}async shutdown(){this.ci=!1,this.us(),this.Li&&(this.Li.cancel(),this.Li=null),this.cs(),this.ls(),await this.$i.runTransaction("shutdown","readwrite",[pr,$r],e=>{const t=new vi(e,rr.ue);return this.Yi(t).next(()=>this.es(t))}),this.$i.close(),this.hs()}rs(e,t){return e.filter(e=>this.ns(e.updateTimeMs,t)&&!this._s(e.clientId))}Ps(){return this.runTransaction("getActiveClients","readonly",e=>bl(e).j().next(e=>this.rs(e,pl).map(e=>e.clientId)))}get started(){return this.ci}getGlobalsCache(){return this.li}getMutationQueue(e,t){return _u.yt(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new hu(e,this.serializer.gt.databaseId)}getDocumentOverlayCache(e){return Lc.yt(this.serializer,e)}getBundleCache(){return this.Ti}runTransaction(e,t,n){Rt(fl,"Starting transaction:",e);const r="readonly"===t?"readonly":"readwrite",i=18===(s=this.Oi)?yi:17===s?gi:16===s?mi:15===s?pi:14===s?fi:13===s?di:12===s?hi:11===s?li:void Mt(60245);var s;let o;return this.$i.runTransaction(e,r,i,r=>(o=new vi(r,this.ui?this.ui.next():rr.ue),"readwrite-primary"===t?this.Ji(o).next(e=>!!e||this.Hi(o)).next(t=>{if(!t)throw Ot(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.Fi.enqueueRetryable(()=>this.qi(!1)),new Bt(jt.FAILED_PRECONDITION,Un);return n(o)}).next(e=>this.Zi(o).next(()=>e)):this.Ts(o).next(()=>n(o)))).then(e=>(o.raiseOnCommittedEvent(),e))}Ts(e){return wl(e).get(mr).next(e=>{if(null!==e&&this.ns(e.leaseTimestampMs,ml)&&!this._s(e.ownerId)&&!this.Xi(e)&&!(this.xi||this.allowTabSynchronization&&e.allowTabSynchronization))throw new Bt(jt.FAILED_PRECONDITION,gl)})}Zi(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return wl(e).put(mr,t)}static C(){return Kn.C()}Yi(e){const t=wl(e);return t.get(mr).next(e=>this.Xi(e)?(Rt(fl,"Releasing primary lease."),t.delete(mr)):qn.resolve())}ns(e,t){const n=Date.now();return!(e<n-t||e>n&&(Ot(`Detected an update time that is in the future: ${e} > ${n}`),1))}Wi(){null!==this.document&&"function"==typeof this.document.addEventListener&&(this.Bi=()=>{this.Fi.enqueueAndForget(()=>(this.inForeground="visible"===this.document.visibilityState,this.Ki()))},this.document.addEventListener("visibilitychange",this.Bi),this.inForeground="visible"===this.document.visibilityState)}cs(){this.Bi&&(this.document.removeEventListener("visibilitychange",this.Bi),this.Bi=null)}Gi(){var e;"function"==typeof(null===(e=this.window)||void 0===e?void 0:e.addEventListener)&&(this.Ni=()=>{this.us();const e=/(?:Version|Mobile)\/1[456]/;_()&&(navigator.appVersion.match(e)||navigator.userAgent.match(e))&&this.Fi.enterRestrictedMode(!0),this.Fi.enqueueAndForget(()=>this.shutdown())},this.window.addEventListener("pagehide",this.Ni))}ls(){this.Ni&&(this.window.removeEventListener("pagehide",this.Ni),this.Ni=null)}_s(e){var t;try{const n=null!==(null===(t=this.Ui)||void 0===t?void 0:t.getItem(this.ss(e)));return Rt(fl,`Client '${e}' ${n?"is":"is not"} zombied in LocalStorage`),n}catch(n){return Ot(fl,"Failed to get zombied client id.",n),!1}}us(){if(this.Ui)try{this.Ui.setItem(this.ss(this.clientId),String(Date.now()))}catch(e){Ot("Failed to set zombie client id.",e)}}hs(){if(this.Ui)try{this.Ui.removeItem(this.ss(this.clientId))}catch(e){}}ss(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function wl(e){return wi(e,pr)}function bl(e){return wi(e,$r)}function Il(e,t){let n=e.projectId;return e.isDefaultDatabase||(n+="."+e.database),"firestore/"+t+"/"+n+"/"
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class _l{constructor(e,t,n,r){this.targetId=e,this.fromCache=t,this.Is=n,this.ds=r}static Es(e,t){let n=Oo(),r=Oo();for(const i of t.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:r=r.add(i.doc.key)}return new _l(e,t.fromCache,n,r)}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tl{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class El{constructor(){this.As=!1,this.Rs=!1,this.Vs=100,this.fs=_()?8:Gn(w())>0?6:4}initialize(e,t){this.gs=e,this.indexManager=t,this.As=!0}getDocumentsMatchingQuery(e,t,n,r){const i={result:null};return this.ps(e,t).next(e=>{i.result=e}).next(()=>{if(!i.result)return this.ys(e,t,r,n).next(e=>{i.result=e})}).next(()=>{if(i.result)return;const n=new Tl;return this.ws(e,t,n).next(r=>{if(i.result=r,this.Rs)return this.Ss(e,t,n,r.size)})}).next(()=>i.result)}Ss(e,t,n,r){return n.documentReadCount<this.Vs?(xt()<=z.DEBUG&&Rt("QueryEngine","SDK will not create cache indexes for query:",yo(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),qn.resolve()):(xt()<=z.DEBUG&&Rt("QueryEngine","Query:",yo(t),"scans",n.documentReadCount,"local documents and returns",r,"documents as results."),n.documentReadCount>this.fs*r?(xt()<=z.DEBUG&&Rt("QueryEngine","The SDK decides to create cache indexes for query:",yo(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,uo(t))):qn.resolve())}ps(e,t){if(oo(t))return qn.resolve(null);let n=uo(t);return this.indexManager.getIndexType(e,n).next(r=>0===r?null:(null!==t.limit&&1===r&&(t=po(t,null,"F"),n=uo(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next(r=>{const i=Oo(...r);return this.gs.getDocuments(e,i).next(r=>this.indexManager.getMinOffset(e,n).next(n=>{const s=this.bs(t,r);return this.Ds(t,s,i,n.readTime)?this.ps(e,po(t,null,"F")):this.vs(e,s,t,n)}))})))}ys(e,t,n,r){return oo(t)||r.isEqual(Cn.min())?qn.resolve(null):this.gs.getDocuments(e,n).next(i=>{const s=this.bs(t,i);return this.Ds(t,s,n,r)?qn.resolve(null):(xt()<=z.DEBUG&&Rt("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),yo(t)),this.vs(e,s,t,Ln(r,An)).next(e=>e))})}bs(e,t){let n=new Ai(bo(e));return t.forEach((t,r)=>{vo(e,r)&&(n=n.add(r))}),n}Ds(e,t,n,r){if(null===e.limit)return!1;if(n.size!==t.size)return!0;const i="F"===e.limitType?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(r)>0)}ws(e,t,n){return xt()<=z.DEBUG&&Rt("QueryEngine","Using full collection scan to execute query:",yo(t)),this.gs.getDocumentsMatchingQuery(e,t,Fn.min(),n)}vs(e,t,n,r){return this.gs.getDocumentsMatchingQuery(e,n,r).next(e=>(t.forEach(t=>{e=e.insert(t.key,t)}),e))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sl="LocalStore";class Cl{constructor(e,t,n,r){this.persistence=e,this.Cs=t,this.serializer=r,this.Fs=new Ei(en),this.Ms=new _o(e=>Xs(e),Ys),this.xs=new Map,this.Os=e.getRemoteDocumentCache(),this.hi=e.getTargetCache(),this.Ti=e.getBundleCache(),this.Ns(n)}Ns(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Xu(this.Os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Os.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.Fs))}}function Al(e,t,n,r){return new Cl(e,t,n,r)}async function kl(e,t){const n=Ut(e);return await n.persistence.runTransaction("Handle user change","readonly",e=>{let r;return n.mutationQueue.getAllMutationBatches(e).next(i=>(r=i,n.Ns(t),n.mutationQueue.getAllMutationBatches(e))).next(t=>{const i=[],s=[];let o=Oo();for(const e of r){i.push(e.batchId);for(const t of e.mutations)o=o.add(t.key)}for(const e of t){s.push(e.batchId);for(const t of e.mutations)o=o.add(t.key)}return n.localDocuments.getDocuments(e,o).next(e=>({Bs:e,removedBatchIds:i,addedBatchIds:s}))})})}function Nl(e){const t=Ut(e);return t.persistence.runTransaction("Get last remote snapshot version","readonly",e=>t.hi.getLastRemoteSnapshotVersion(e))}function Dl(e,t,n){let r=Oo(),i=Oo();return n.forEach(e=>r=r.add(e)),t.getEntries(e,r).next(e=>{let r=Eo();return n.forEach((n,s)=>{const o=e.get(n);s.isFoundDocument()!==o.isFoundDocument()&&(i=i.add(n)),s.isNoDocument()&&s.version.isEqual(Cn.min())?(t.removeEntry(n,s.readTime),r=r.insert(n,s)):!o.isValidDocument()||s.version.compareTo(o.version)>0||0===s.version.compareTo(o.version)&&o.hasPendingWrites?(t.addEntry(s),r=r.insert(n,s)):Rt(Sl,"Ignoring outdated watch update for ",n,". Current version:",o.version," Watch version:",s.version)}),{Ls:r,ks:i}})}function xl(e,t){const n=Ut(e);return n.persistence.runTransaction("Get next mutation batch","readonly",e=>(void 0===t&&(t=ir),n.mutationQueue.getNextMutationBatchAfterBatchId(e,t)))}function Rl(e,t){const n=Ut(e);return n.persistence.runTransaction("Allocate target","readwrite",e=>{let r;return n.hi.getTargetData(e,t).next(i=>i?(r=i,qn.resolve(r)):n.hi.allocateTargetId(e).next(i=>(r=new wc(t,i,"TargetPurposeListen",e.currentSequenceNumber),n.hi.addTargetData(e,r).next(()=>r))))}).then(e=>{const r=n.Fs.get(e.targetId);return(null===r||e.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(n.Fs=n.Fs.insert(e.targetId,e),n.Ms.set(t,e.targetId)),e})}async function Ol(e,t,n){const r=Ut(e),i=r.Fs.get(t),s=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",s,e=>r.persistence.referenceDelegate.removeTarget(e,i))}catch(o){if(!Qn(o))throw o;Rt(Sl,`Failed to update sequence numbers for target ${t}: ${o}`)}r.Fs=r.Fs.remove(t),r.Ms.delete(i.target)}function Pl(e,t,n){const r=Ut(e);let i=Cn.min(),s=Oo();return r.persistence.runTransaction("Execute query","readwrite",e=>function(e,t,n){const r=Ut(e),i=r.Ms.get(n);return void 0!==i?qn.resolve(r.Fs.get(i)):r.hi.getTargetData(t,n)}(r,e,uo(t)).next(t=>{if(t)return i=t.lastLimboFreeSnapshotVersion,r.hi.getMatchingKeysForTargetId(e,t.targetId).next(e=>{s=e})}).next(()=>r.Cs.getDocumentsMatchingQuery(e,t,n?i:Cn.min(),n?s:Oo())).next(e=>(Fl(r,wo(t),e),{documents:e,qs:s})))}function Ll(e,t){const n=Ut(e),r=Ut(n.hi),i=n.Fs.get(t);return i?Promise.resolve(i.target):n.persistence.runTransaction("Get target data","readonly",e=>r.Et(e,t).next(e=>e?e.target:null))}function Ml(e,t){const n=Ut(e),r=n.xs.get(t)||Cn.min();return n.persistence.runTransaction("Get new document changes","readonly",e=>n.Os.getAllFromCollectionGroup(e,t,Ln(r,An),Number.MAX_SAFE_INTEGER)).then(e=>(Fl(n,t,e),e))}function Fl(e,t,n){let r=e.xs.get(t)||Cn.min();n.forEach((e,t)=>{t.readTime.compareTo(r)>0&&(r=t.readTime)}),e.xs.set(t,r)}async function Vl(e,t,n=Oo()){const r=await Rl(e,uo(kc(t.bundledQuery))),i=Ut(e);return i.persistence.runTransaction("Save named query","readwrite",e=>{const s=Ga(t.readTime);if(r.snapshotVersion.compareTo(s)>=0)return i.Ti.saveNamedQuery(e,t);const o=r.withResumeToken(Ri.EMPTY_BYTE_STRING,s);return i.Fs=i.Fs.insert(o.targetId,o),i.hi.updateTargetData(e,o).next(()=>i.hi.removeMatchingKeysForTargetId(e,r.targetId)).next(()=>i.hi.addMatchingKeys(e,n,r.targetId)).next(()=>i.Ti.saveNamedQuery(e,t))})}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ul="firestore_clients";function jl(e,t){return`${Ul}_${e}_${t}`}const Bl="firestore_mutations";function ql(e,t,n){let r=`${Bl}_${e}_${n}`;return t.isAuthenticated()&&(r+=`_${t.uid}`),r}const zl="firestore_targets";function $l(e,t){return`${zl}_${e}_${t}`}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kl="SharedClientState";class Gl{constructor(e,t,n,r){this.user=e,this.batchId=t,this.state=n,this.error=r}static Ks(e,t,n){const r=JSON.parse(n);let i,s="object"==typeof r&&-1!==["pending","acknowledged","rejected"].indexOf(r.state)&&(void 0===r.error||"object"==typeof r.error);return s&&r.error&&(s="string"==typeof r.error.message&&"string"==typeof r.error.code,s&&(i=new Bt(r.error.code,r.error.message))),s?new Gl(e,t,r.state,i):(Ot(Kl,`Failed to parse mutation state for ID '${t}': ${n}`),null)}Ws(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class Hl{constructor(e,t,n){this.targetId=e,this.state=t,this.error=n}static Ks(e,t){const n=JSON.parse(t);let r,i="object"==typeof n&&-1!==["not-current","current","rejected"].indexOf(n.state)&&(void 0===n.error||"object"==typeof n.error);return i&&n.error&&(i="string"==typeof n.error.message&&"string"==typeof n.error.code,i&&(r=new Bt(n.error.code,n.error.message))),i?new Hl(e,n.state,r):(Ot(Kl,`Failed to parse target state for ID '${e}': ${t}`),null)}Ws(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class Wl{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static Ks(e,t){const n=JSON.parse(t);let r="object"==typeof n&&n.activeTargetIds instanceof Array,i=Lo();for(let s=0;r&&s<n.activeTargetIds.length;++s)r=ar(n.activeTargetIds[s]),i=i.add(n.activeTargetIds[s]);return r?new Wl(e,i):(Ot(Kl,`Failed to parse client data for instance '${e}': ${t}`),null)}}class Ql{constructor(e,t){this.clientId=e,this.onlineState=t}static Ks(e){const t=JSON.parse(e);return"object"==typeof t&&-1!==["Unknown","Online","Offline"].indexOf(t.onlineState)&&"string"==typeof t.clientId?new Ql(t.clientId,t.onlineState):(Ot(Kl,`Failed to parse online state: ${e}`),null)}}class Jl{constructor(){this.activeTargetIds=Lo()}Gs(e){this.activeTargetIds=this.activeTargetIds.add(e)}zs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Xl{constructor(e,t,n,r,i){this.window=e,this.Fi=t,this.persistenceKey=n,this.js=r,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.Js=this.Hs.bind(this),this.Ys=new Ei(en),this.started=!1,this.Zs=[];const s=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=i,this.Xs=jl(this.persistenceKey,this.js),this.eo=`firestore_sequence_number_${this.persistenceKey}`,this.Ys=this.Ys.insert(this.js,new Jl),this.no=new RegExp(`^${Ul}_${s}_([^_]*)$`),this.ro=new RegExp(`^${Bl}_${s}_(\\d+)(?:_(.*))?$`),this.io=new RegExp(`^${zl}_${s}_(\\d+)$`),this.so=function(e){return`firestore_online_state_${e}`}(this.persistenceKey),this.oo=function(e){return`firestore_bundle_loaded_v2_${e}`}(this.persistenceKey),this.window.addEventListener("storage",this.Js)}static C(e){return!(!e||!e.localStorage)}async start(){const e=await this.syncEngine.Ps();for(const n of e){if(n===this.js)continue;const e=this.getItem(jl(this.persistenceKey,n));if(e){const t=Wl.Ks(n,e);t&&(this.Ys=this.Ys.insert(t.clientId,t))}}this._o();const t=this.storage.getItem(this.so);if(t){const e=this.ao(t);e&&this.uo(e)}for(const n of this.Zs)this.Hs(n);this.Zs=[],this.window.addEventListener("pagehide",()=>this.shutdown()),this.started=!0}writeSequenceNumber(e){this.setItem(this.eo,JSON.stringify(e))}getAllActiveQueryTargets(){return this.co(this.Ys)}isActiveQueryTarget(e){let t=!1;return this.Ys.forEach((n,r)=>{r.activeTargetIds.has(e)&&(t=!0)}),t}addPendingMutation(e){this.lo(e,"pending")}updateMutationState(e,t,n){this.lo(e,t,n),this.ho(e)}addLocalQueryTarget(e,t=!0){let n="not-current";if(this.isActiveQueryTarget(e)){const t=this.storage.getItem($l(this.persistenceKey,e));if(t){const r=Hl.Ks(e,t);r&&(n=r.state)}}return t&&this.Po.Gs(e),this._o(),n}removeLocalQueryTarget(e){this.Po.zs(e),this._o()}isLocalQueryTarget(e){return this.Po.activeTargetIds.has(e)}clearQueryState(e){this.removeItem($l(this.persistenceKey,e))}updateQueryState(e,t,n){this.To(e,t,n)}handleUserChange(e,t,n){t.forEach(e=>{this.ho(e)}),this.currentUser=e,n.forEach(e=>{this.addPendingMutation(e)})}setOnlineState(e){this.Io(e)}notifyBundleLoaded(e){this.Eo(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.Js),this.removeItem(this.Xs),this.started=!1)}getItem(e){const t=this.storage.getItem(e);return Rt(Kl,"READ",e,t),t}setItem(e,t){Rt(Kl,"SET",e,t),this.storage.setItem(e,t)}removeItem(e){Rt(Kl,"REMOVE",e),this.storage.removeItem(e)}Hs(e){const t=e;if(t.storageArea===this.storage){if(Rt(Kl,"EVENT",t.key,t.newValue),t.key===this.Xs)return void Ot("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.Fi.enqueueRetryable(async()=>{if(this.started){if(null!==t.key)if(this.no.test(t.key)){if(null==t.newValue){const e=this.Ao(t.key);return this.Ro(e,null)}{const e=this.Vo(t.key,t.newValue);if(e)return this.Ro(e.clientId,e)}}else if(this.ro.test(t.key)){if(null!==t.newValue){const e=this.mo(t.key,t.newValue);if(e)return this.fo(e)}}else if(this.io.test(t.key)){if(null!==t.newValue){const e=this.po(t.key,t.newValue);if(e)return this.yo(e)}}else if(t.key===this.so){if(null!==t.newValue){const e=this.ao(t.newValue);if(e)return this.uo(e)}}else if(t.key===this.eo){const e=function(e){let t=rr.ue;if(null!=e)try{const n=JSON.parse(e);Vt("number"==typeof n,30636,{wo:e}),t=n}catch(n){Ot(Kl,"Failed to read sequence number from WebStorage",n)}return t}(t.newValue);e!==rr.ue&&this.sequenceNumberHandler(e)}else if(t.key===this.oo){const e=this.So(t.newValue);await Promise.all(e.map(e=>this.syncEngine.bo(e)))}}else this.Zs.push(t)})}}get Po(){return this.Ys.get(this.js)}_o(){this.setItem(this.Xs,this.Po.Ws())}lo(e,t,n){const r=new Gl(this.currentUser,e,t,n),i=ql(this.persistenceKey,this.currentUser,e);this.setItem(i,r.Ws())}ho(e){const t=ql(this.persistenceKey,this.currentUser,e);this.removeItem(t)}Io(e){const t={clientId:this.js,onlineState:e};this.storage.setItem(this.so,JSON.stringify(t))}To(e,t,n){const r=$l(this.persistenceKey,e),i=new Hl(e,t,n);this.setItem(r,i.Ws())}Eo(e){const t=JSON.stringify(Array.from(e));this.setItem(this.oo,t)}Ao(e){const t=this.no.exec(e);return t?t[1]:null}Vo(e,t){const n=this.Ao(e);return Wl.Ks(n,t)}mo(e,t){const n=this.ro.exec(e),r=Number(n[1]),i=void 0!==n[2]?n[2]:null;return Gl.Ks(new kt(i),r,t)}po(e,t){const n=this.io.exec(e),r=Number(n[1]);return Hl.Ks(r,t)}ao(e){return Ql.Ks(e)}So(e){return JSON.parse(e)}async fo(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.Do(e.batchId,e.state,e.error);Rt(Kl,`Ignoring mutation for non-active user ${e.user.uid}`)}yo(e){return this.syncEngine.vo(e.targetId,e.state,e.error)}Ro(e,t){const n=t?this.Ys.insert(e,t):this.Ys.remove(e),r=this.co(this.Ys),i=this.co(n),s=[],o=[];return i.forEach(e=>{r.has(e)||s.push(e)}),r.forEach(e=>{i.has(e)||o.push(e)}),this.syncEngine.Co(s,o).then(()=>{this.Ys=n})}uo(e){this.Ys.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}co(e){let t=Lo();return e.forEach((e,n)=>{t=t.unionWith(n.activeTargetIds)}),t}}class Yl{constructor(){this.Fo=new Jl,this.Mo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.Fo.Gs(e),this.Mo[e]||"not-current"}updateQueryState(e,t,n){this.Mo[e]=t}removeLocalQueryTarget(e){this.Fo.zs(e)}isLocalQueryTarget(e){return this.Fo.activeTargetIds.has(e)}clearQueryState(e){delete this.Mo[e]}getAllActiveQueryTargets(){return this.Fo.activeTargetIds}isActiveQueryTarget(e){return this.Fo.activeTargetIds.has(e)}start(){return this.Fo=new Jl,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zl{xo(e){}shutdown(){}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eh="ConnectivityMonitor";class th{constructor(){this.Oo=()=>this.No(),this.Bo=()=>this.Lo(),this.ko=[],this.qo()}xo(e){this.ko.push(e)}shutdown(){window.removeEventListener("online",this.Oo),window.removeEventListener("offline",this.Bo)}qo(){window.addEventListener("online",this.Oo),window.addEventListener("offline",this.Bo)}No(){Rt(eh,"Network connectivity changed: AVAILABLE");for(const e of this.ko)e(0)}Lo(){Rt(eh,"Network connectivity changed: UNAVAILABLE");for(const e of this.ko)e(1)}static C(){return"undefined"!=typeof window&&void 0!==window.addEventListener&&void 0!==window.removeEventListener}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let nh=null;function rh(){return null===nh?nh=268435456+Math.round(2147483648*Math.random()):nh++,"0x"+nh.toString(16)
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}const ih="RestConnection",sh={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class oh{get Qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.$o=t+"://"+e.host,this.Uo=`projects/${n}/databases/${r}`,this.Ko=this.databaseId.database===Ki?`project_id=${n}`:`project_id=${n}&database_id=${r}`}Wo(e,t,n,r,i){const s=rh(),o=this.Go(e,t.toUriEncodedString());Rt(ih,`Sending RPC '${e}' ${s}:`,o,n);const a={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.Ko};this.zo(a,r,i);const{host:c}=new URL(o),u=f(c);return this.jo(e,o,a,n,u).then(t=>(Rt(ih,`Received RPC '${e}' ${s}: `,t),t),t=>{throw Pt(ih,`RPC '${e}' ${s} failed with error: `,t,"url: ",o,"request:",n),t})}Jo(e,t,n,r,i,s){return this.Wo(e,t,n,r,i)}zo(e,t,n){e["X-Goog-Api-Client"]="gl-js/ fire/"+Nt,e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((t,n)=>e[n]=t),n&&n.headers.forEach((t,n)=>e[n]=t)}Go(e,t){const n=sh[e];return`${this.$o}/v1/${t}:${n}`}terminate(){}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ah{constructor(e){this.Ho=e.Ho,this.Yo=e.Yo}Zo(e){this.Xo=e}e_(e){this.t_=e}n_(e){this.r_=e}onMessage(e){this.i_=e}close(){this.Yo()}send(e){this.Ho(e)}s_(){this.Xo()}o_(){this.t_()}__(e){this.r_(e)}a_(e){this.i_(e)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ch="WebChannelConnection";class uh extends oh{constructor(e){super(e),this.u_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}jo(e,t,n,r,i){const s=rh();return new Promise((i,o)=>{const a=new yt;a.setWithCredentials(!0),a.listenOnce(wt.COMPLETE,()=>{try{switch(a.getLastErrorCode()){case bt.NO_ERROR:const t=a.getResponseJson();Rt(ch,`XHR for RPC '${e}' ${s} received:`,JSON.stringify(t)),i(t);break;case bt.TIMEOUT:Rt(ch,`RPC '${e}' ${s} timed out`),o(new Bt(jt.DEADLINE_EXCEEDED,"Request time out"));break;case bt.HTTP_ERROR:const n=a.getStatus();if(Rt(ch,`RPC '${e}' ${s} failed with status:`,n,"response text:",a.getResponseText()),n>0){let e=a.getResponseJson();Array.isArray(e)&&(e=e[0]);const t=null==e?void 0:e.error;if(t&&t.status&&t.message){const e=function(e){const t=e.toLowerCase().replace(/_/g,"-");return Object.values(jt).indexOf(t)>=0?t:jt.UNKNOWN}(t.status);o(new Bt(e,t.message))}else o(new Bt(jt.UNKNOWN,"Server responded with status "+a.getStatus()))}else o(new Bt(jt.UNAVAILABLE,"Connection failed."));break;default:Mt(9055,{c_:e,streamId:s,l_:a.getLastErrorCode(),h_:a.getLastError()})}}finally{Rt(ch,`RPC '${e}' ${s} completed.`)}});const c=JSON.stringify(r);Rt(ch,`RPC '${e}' ${s} sending request:`,r),a.send(t,"POST",c,n,15)})}P_(e,t,n){const r=rh(),i=[this.$o,"/","google.firestore.v1.Firestore","/",e,"/channel"],s=Et(),o=Tt(),a={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},c=this.longPollingOptions.timeoutSeconds;void 0!==c&&(a.longPollingTimeout=Math.round(1e3*c)),this.useFetchStreams&&(a.useFetchStreams=!0),this.zo(a.initMessageHeaders,t,n),a.encodeInitMessageHeaders=!0;const u=i.join("");Rt(ch,`Creating RPC '${e}' stream ${r}: ${u}`,a);const l=s.createWebChannel(u,a);this.T_(l);let h=!1,d=!1;const f=new ah({Ho:t=>{d?Rt(ch,`Not sending because RPC '${e}' stream ${r} is closed:`,t):(h||(Rt(ch,`Opening RPC '${e}' stream ${r} transport.`),l.open(),h=!0),Rt(ch,`RPC '${e}' stream ${r} sending:`,t),l.send(t))},Yo:()=>l.close()}),p=(e,t,n)=>{e.listen(t,e=>{try{n(e)}catch(t){setTimeout(()=>{throw t},0)}})};return p(l,vt.EventType.OPEN,()=>{d||(Rt(ch,`RPC '${e}' stream ${r} transport opened.`),f.s_())}),p(l,vt.EventType.CLOSE,()=>{d||(d=!0,Rt(ch,`RPC '${e}' stream ${r} transport closed`),f.__(),this.I_(l))}),p(l,vt.EventType.ERROR,t=>{d||(d=!0,Pt(ch,`RPC '${e}' stream ${r} transport errored. Name:`,t.name,"Message:",t.message),f.__(new Bt(jt.UNAVAILABLE,"The operation could not be completed")))}),p(l,vt.EventType.MESSAGE,t=>{var n;if(!d){const i=t.data[0];Vt(!!i,16349);const s=i,o=(null==s?void 0:s.error)||(null===(n=s[0])||void 0===n?void 0:n.error);if(o){Rt(ch,`RPC '${e}' stream ${r} received error:`,o);const t=o.status;let n=function(e){const t=wa[e];if(void 0!==t)return _a(t)}(t),i=o.message;void 0===n&&(n=jt.INTERNAL,i="Unknown error status: "+t+" with message "+o.message),d=!0,f.__(new Bt(n,i)),l.close()}else Rt(ch,`RPC '${e}' stream ${r} received:`,i),f.a_(i)}}),p(o,_t.STAT_EVENT,t=>{t.stat===It.PROXY?Rt(ch,`RPC '${e}' stream ${r} detected buffering proxy`):t.stat===It.NOPROXY&&Rt(ch,`RPC '${e}' stream ${r} detected no buffering proxy`)}),setTimeout(()=>{f.o_()},0),f}terminate(){this.u_.forEach(e=>e.close()),this.u_=[]}T_(e){this.u_.push(e)}I_(e){this.u_=this.u_.filter(t=>t===e)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lh(){return"undefined"!=typeof window?window:null}function hh(){return"undefined"!=typeof document?document:null}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dh(e){return new Ba(e,!0)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fh{constructor(e,t,n=1e3,r=1.5,i=6e4){this.Fi=e,this.timerId=t,this.d_=n,this.E_=r,this.A_=i,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(e){this.cancel();const t=Math.floor(this.R_+this.p_()),n=Math.max(0,Date.now()-this.m_),r=Math.max(0,t-n);r>0&&Rt("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.R_} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,r,()=>(this.m_=Date.now(),e())),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){null!==this.V_&&(this.V_.skipDelay(),this.V_=null)}cancel(){null!==this.V_&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ph="PersistentStream";class mh{constructor(e,t,n,r,i,s,o,a){this.Fi=e,this.w_=n,this.S_=r,this.connection=i,this.authCredentialsProvider=s,this.appCheckCredentialsProvider=o,this.listener=a,this.state=0,this.b_=0,this.D_=null,this.v_=null,this.stream=null,this.C_=0,this.F_=new fh(e,t)}M_(){return 1===this.state||5===this.state||this.x_()}x_(){return 2===this.state||3===this.state}start(){this.C_=0,4!==this.state?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&null===this.D_&&(this.D_=this.Fi.enqueueAfterDelay(this.w_,6e4,()=>this.L_()))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}Q_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.Q_(),this.F_.cancel(),this.b_++,4!==e?this.F_.reset():t&&t.code===jt.RESOURCE_EXHAUSTED?(Ot(t.toString()),Ot("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):t&&t.code===jt.UNAUTHENTICATED&&3!==this.state&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),null!==this.stream&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.n_(t)}U_(){}auth(){this.state=1;const e=this.K_(this.b_),t=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([e,n])=>{this.b_===t&&this.W_(e,n)},t=>{e(()=>{const e=new Bt(jt.UNKNOWN,"Fetching auth token failed: "+t.message);return this.G_(e)})})}W_(e,t){const n=this.K_(this.b_);this.stream=this.z_(e,t),this.stream.Zo(()=>{n(()=>this.listener.Zo())}),this.stream.e_(()=>{n(()=>(this.state=2,this.v_=this.Fi.enqueueAfterDelay(this.S_,1e4,()=>(this.x_()&&(this.state=3),Promise.resolve())),this.listener.e_()))}),this.stream.n_(e=>{n(()=>this.G_(e))}),this.stream.onMessage(e=>{n(()=>1==++this.C_?this.j_(e):this.onNext(e))})}O_(){this.state=5,this.F_.g_(async()=>{this.state=0,this.start()})}G_(e){return Rt(ph,`close with error: ${e}`),this.stream=null,this.close(4,e)}K_(e){return t=>{this.Fi.enqueueAndForget(()=>this.b_===e?t():(Rt(ph,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class gh extends mh{constructor(e,t,n,r,i,s){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,r,s),this.serializer=i}z_(e,t){return this.connection.P_("Listen",e,t)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const t=function(e,t){let n;if("targetChange"in t){t.targetChange;const i="NO_CHANGE"===(r=t.targetChange.targetChangeType||"NO_CHANGE")?0:"ADD"===r?1:"REMOVE"===r?2:"CURRENT"===r?3:"RESET"===r?4:Mt(39313,{state:r}),s=t.targetChange.targetIds||[],o=function(e,t){return e.useProto3Json?(Vt(void 0===t||"string"==typeof t,58123),Ri.fromBase64String(t||"")):(Vt(void 0===t||t instanceof Buffer||t instanceof Uint8Array,16193),Ri.fromUint8Array(t||new Uint8Array))}(e,t.targetChange.resumeToken),a=t.targetChange.cause,c=a&&function(e){const t=void 0===e.code?jt.UNKNOWN:_a(e.code);return new Bt(t,e.message||"")}(a);n=new Oa(i,s,o,c||null)}else if("documentChange"in t){t.documentChange;const r=t.documentChange;r.document,r.document.name,r.document.updateTime;const i=Xa(e,r.document.name),s=Ga(r.document.updateTime),o=r.document.createTime?Ga(r.document.createTime):Cn.min(),a=new _s({mapValue:{fields:r.document.fields}}),c=Es.newFoundDocument(i,s,o,a),u=r.targetIds||[],l=r.removedTargetIds||[];n=new xa(u,l,c.key,c)}else if("documentDelete"in t){t.documentDelete;const r=t.documentDelete;r.document;const i=Xa(e,r.document),s=r.readTime?Ga(r.readTime):Cn.min(),o=Es.newNoDocument(i,s),a=r.removedTargetIds||[];n=new xa([],a,o.key,o)}else if("documentRemove"in t){t.documentRemove;const r=t.documentRemove;r.document;const i=Xa(e,r.document),s=r.removedTargetIds||[];n=new xa([],s,i,null)}else{if(!("filter"in t))return Mt(11601,{At:t});{t.filter;const e=t.filter;e.targetId;const{count:r=0,unchangedNames:i}=e,s=new va(r,i),o=e.targetId;n=new Ra(o,s)}}var r;return n}(this.serializer,e),n=function(e){if(!("targetChange"in e))return Cn.min();const t=e.targetChange;return t.targetIds&&t.targetIds.length?Cn.min():t.readTime?Ga(t.readTime):Cn.min()}(e);return this.listener.J_(t,n)}H_(e){const t={};t.database=ec(this.serializer),t.addTarget=function(e,t){let n;const r=t.target;if(n=Zs(r)?{documents:oc(e,r)}:{query:ac(e,r).Vt},n.targetId=t.targetId,t.resumeToken.approximateByteSize()>0){n.resumeToken=$a(e,t.resumeToken);const r=qa(e,t.expectedCount);null!==r&&(n.expectedCount=r)}else if(t.snapshotVersion.compareTo(Cn.min())>0){n.readTime=za(e,t.snapshotVersion.toTimestamp());const r=qa(e,t.expectedCount);null!==r&&(n.expectedCount=r)}return n}(this.serializer,e);const n=function(e,t){const n=function(e){switch(e){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Mt(28987,{purpose:e})}}(t.purpose);return null==n?null:{"goog-listen-tags":n}}(this.serializer,e);n&&(t.labels=n),this.k_(t)}Y_(e){const t={};t.database=ec(this.serializer),t.removeTarget=e,this.k_(t)}}class yh extends mh{constructor(e,t,n,r,i,s){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,r,s),this.serializer=i}get Z_(){return this.C_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.Z_&&this.X_([])}z_(e,t){return this.connection.P_("Write",e,t)}j_(e){return Vt(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,Vt(!e.writeResults||0===e.writeResults.length,55816),this.listener.ea()}onNext(e){Vt(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const t=function(e,t){return e&&e.length>0?(Vt(void 0!==t,14353),e.map(e=>function(e,t){let n=e.updateTime?Ga(e.updateTime):Ga(t);return n.isEqual(Cn.min())&&(n=Ga(t)),new Yo(n,e.transformResults||[])}(e,t))):[]}(e.writeResults,e.commitTime),n=Ga(e.commitTime);return this.listener.ta(n,t)}na(){const e={};e.database=ec(this.serializer),this.k_(e)}X_(e){const t={streamToken:this.lastStreamToken,writes:e.map(e=>ic(this.serializer,e))};this.k_(t)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vh{}class wh extends vh{constructor(e,t,n,r){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=r,this.ra=!1}ia(){if(this.ra)throw new Bt(jt.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,n,r){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,s])=>this.connection.Wo(e,Wa(t,n),r,i,s)).catch(e=>{throw"FirebaseError"===e.name?(e.code===jt.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new Bt(jt.UNKNOWN,e.toString())})}Jo(e,t,n,r,i){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.Jo(e,Wa(t,n),r,s,o,i)).catch(e=>{throw"FirebaseError"===e.name?(e.code===jt.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new Bt(jt.UNKNOWN,e.toString())})}terminate(){this.ra=!0,this.connection.terminate()}}class bh{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){0===this.sa&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve())))}la(e){"Online"===this.state?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,"Online"===e&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const t=`Could not reach Cloud Firestore backend. ${e}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(Ot(t),this._a=!1):Rt("OnlineStateTracker",t)}ha(){null!==this.oa&&(this.oa.cancel(),this.oa=null)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ih="RemoteStore";class _h{constructor(e,t,n,r,i){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Set,this.da=[],this.Ea=i,this.Ea.xo(e=>{n.enqueueAndForget(async()=>{xh(this)&&(Rt(Ih,"Restarting streams for network reachability change."),await async function(e){const t=Ut(e);t.Ia.add(4),await Eh(t),t.Aa.set("Unknown"),t.Ia.delete(4),await Th(t)}(this))})}),this.Aa=new bh(n,r)}}async function Th(e){if(xh(e))for(const t of e.da)await t(!0)}async function Eh(e){for(const t of e.da)await t(!1)}function Sh(e,t){const n=Ut(e);n.Ta.has(t.targetId)||(n.Ta.set(t.targetId,t),Dh(n)?Nh(n):Jh(n).x_()&&Ah(n,t))}function Ch(e,t){const n=Ut(e),r=Jh(n);n.Ta.delete(t),r.x_()&&kh(n,t),0===n.Ta.size&&(r.x_()?r.B_():xh(n)&&n.Aa.set("Unknown"))}function Ah(e,t){if(e.Ra.$e(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(Cn.min())>0){const n=e.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(n)}Jh(e).H_(t)}function kh(e,t){e.Ra.$e(t),Jh(e).Y_(t)}function Nh(e){e.Ra=new La({getRemoteKeysForTarget:t=>e.remoteSyncer.getRemoteKeysForTarget(t),Et:t=>e.Ta.get(t)||null,lt:()=>e.datastore.serializer.databaseId}),Jh(e).start(),e.Aa.aa()}function Dh(e){return xh(e)&&!Jh(e).M_()&&e.Ta.size>0}function xh(e){return 0===Ut(e).Ia.size}function Rh(e){e.Ra=void 0}async function Oh(e){e.Aa.set("Online")}async function Ph(e){e.Ta.forEach((t,n)=>{Ah(e,t)})}async function Lh(e,t){Rh(e),Dh(e)?(e.Aa.la(t),Nh(e)):e.Aa.set("Unknown")}async function Mh(e,t,n){if(e.Aa.set("Online"),t instanceof Oa&&2===t.state&&t.cause)try{await async function(e,t){const n=t.cause;for(const r of t.targetIds)e.Ta.has(r)&&(await e.remoteSyncer.rejectListen(r,n),e.Ta.delete(r),e.Ra.removeTarget(r))}(e,t)}catch(r){Rt(Ih,"Failed to remove targets %s: %s ",t.targetIds.join(","),r),await Fh(e,r)}else if(t instanceof xa?e.Ra.Ye(t):t instanceof Ra?e.Ra.it(t):e.Ra.et(t),!n.isEqual(Cn.min()))try{const t=await Nl(e.localStore);n.compareTo(t)>=0&&await function(e,t){const n=e.Ra.Pt(t);return n.targetChanges.forEach((n,r)=>{if(n.resumeToken.approximateByteSize()>0){const i=e.Ta.get(r);i&&e.Ta.set(r,i.withResumeToken(n.resumeToken,t))}}),n.targetMismatches.forEach((t,n)=>{const r=e.Ta.get(t);if(!r)return;e.Ta.set(t,r.withResumeToken(Ri.EMPTY_BYTE_STRING,r.snapshotVersion)),kh(e,t);const i=new wc(r.target,t,n,r.sequenceNumber);Ah(e,i)}),e.remoteSyncer.applyRemoteEvent(n)}(e,n)}catch(i){Rt(Ih,"Failed to raise snapshot:",i),await Fh(e,i)}}async function Fh(e,t,n){if(!Qn(t))throw t;e.Ia.add(1),await Eh(e),e.Aa.set("Offline"),n||(n=()=>Nl(e.localStore)),e.asyncQueue.enqueueRetryable(async()=>{Rt(Ih,"Retrying IndexedDB access"),await n(),e.Ia.delete(1),await Th(e)})}function Vh(e,t){return t().catch(n=>Fh(e,n,t))}async function Uh(e){const t=Ut(e),n=Xh(t);let r=t.Pa.length>0?t.Pa[t.Pa.length-1].batchId:ir;for(;jh(t);)try{const e=await xl(t.localStore,r);if(null===e){0===t.Pa.length&&n.B_();break}r=e.batchId,Bh(t,e)}catch(i){await Fh(t,i)}qh(t)&&zh(t)}function jh(e){return xh(e)&&e.Pa.length<10}function Bh(e,t){e.Pa.push(t);const n=Xh(e);n.x_()&&n.Z_&&n.X_(t.mutations)}function qh(e){return xh(e)&&!Xh(e).M_()&&e.Pa.length>0}function zh(e){Xh(e).start()}async function $h(e){Xh(e).na()}async function Kh(e){const t=Xh(e);for(const n of e.Pa)t.X_(n.mutations)}async function Gh(e,t,n){const r=e.Pa.shift(),i=ma.from(r,t,n);await Vh(e,()=>e.remoteSyncer.applySuccessfulWrite(i)),await Uh(e)}async function Hh(e,t){t&&Xh(e).Z_&&await async function(e,t){if(Ia(n=t.code)&&n!==jt.ABORTED){const n=e.Pa.shift();Xh(e).N_(),await Vh(e,()=>e.remoteSyncer.rejectFailedWrite(n.batchId,t)),await Uh(e)}var n}(e,t),qh(e)&&zh(e)}async function Wh(e,t){const n=Ut(e);n.asyncQueue.verifyOperationInProgress(),Rt(Ih,"RemoteStore received new credentials");const r=xh(n);n.Ia.add(3),await Eh(n),r&&n.Aa.set("Unknown"),await n.remoteSyncer.handleCredentialChange(t),n.Ia.delete(3),await Th(n)}async function Qh(e,t){const n=Ut(e);t?(n.Ia.delete(2),await Th(n)):t||(n.Ia.add(2),await Eh(n),n.Aa.set("Unknown"))}function Jh(e){return e.Va||(e.Va=function(e,t,n){const r=Ut(e);return r.ia(),new gh(t,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,n)}(e.datastore,e.asyncQueue,{Zo:Oh.bind(null,e),e_:Ph.bind(null,e),n_:Lh.bind(null,e),J_:Mh.bind(null,e)}),e.da.push(async t=>{t?(e.Va.N_(),Dh(e)?Nh(e):e.Aa.set("Unknown")):(await e.Va.stop(),Rh(e))})),e.Va}function Xh(e){return e.ma||(e.ma=function(e,t,n){const r=Ut(e);return r.ia(),new yh(t,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,n)}(e.datastore,e.asyncQueue,{Zo:()=>Promise.resolve(),e_:$h.bind(null,e),n_:Hh.bind(null,e),ea:Kh.bind(null,e),ta:Gh.bind(null,e)}),e.da.push(async t=>{t?(e.ma.N_(),await Uh(e)):(await e.ma.stop(),e.Pa.length>0&&(Rt(Ih,`Stopping write stream with ${e.Pa.length} pending writes`),e.Pa=[]))})),e.ma
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class Yh{constructor(e,t,n,r,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=r,this.removalCallback=i,this.deferred=new qt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(e=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,r,i){const s=Date.now()+n,o=new Yh(e,t,s,r,i);return o.start(n),o}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){null!==this.timerHandle&&(this.clearTimeout(),this.deferred.reject(new Bt(jt.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>null!==this.timerHandle?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){null!==this.timerHandle&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Zh(e,t){if(Ot("AsyncQueue",`${t}: ${e}`),Qn(e))return new Bt(jt.UNAVAILABLE,`${t}: ${e}`);throw e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ed{static emptySet(e){return new ed(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||dn.comparator(t.key,n.key):(e,t)=>dn.comparator(e.key,t.key),this.keyedMap=Co(),this.sortedSet=new Ei(this.comparator)}has(e){return null!=this.keyedMap.get(e)}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,n)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof ed))return!1;if(this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const e=t.getNext().key,r=n.getNext().key;if(!e.isEqual(r))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),0===e.length?"DocumentSet ()":"DocumentSet (\n  "+e.join("  \n")+"\n)"}copy(e,t){const n=new ed;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class td{constructor(){this.fa=new Ei(dn.comparator)}track(e){const t=e.doc.key,n=this.fa.get(t);n?0!==e.type&&3===n.type?this.fa=this.fa.insert(t,e):3===e.type&&1!==n.type?this.fa=this.fa.insert(t,{type:n.type,doc:e.doc}):2===e.type&&2===n.type?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):2===e.type&&0===n.type?this.fa=this.fa.insert(t,{type:0,doc:e.doc}):1===e.type&&0===n.type?this.fa=this.fa.remove(t):1===e.type&&2===n.type?this.fa=this.fa.insert(t,{type:1,doc:n.doc}):0===e.type&&1===n.type?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):Mt(63341,{At:e,ga:n}):this.fa=this.fa.insert(t,e)}pa(){const e=[];return this.fa.inorderTraversal((t,n)=>{e.push(n)}),e}}class nd{constructor(e,t,n,r,i,s,o,a,c){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=r,this.mutatedKeys=i,this.fromCache=s,this.syncStateChanged=o,this.excludesMetadataChanges=a,this.hasCachedResults=c}static fromInitialDocuments(e,t,n,r,i){const s=[];return t.forEach(e=>{s.push({type:0,doc:e})}),new nd(e,t,ed.emptySet(t),s,n,r,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&mo(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let r=0;r<t.length;r++)if(t[r].type!==n[r].type||!t[r].doc.isEqual(n[r].doc))return!1;return!0}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rd{constructor(){this.ya=void 0,this.wa=[]}Sa(){return this.wa.some(e=>e.ba())}}class id{constructor(){this.queries=sd(),this.onlineState="Unknown",this.Da=new Set}terminate(){!function(e,t){const n=Ut(e),r=n.queries;n.queries=sd(),r.forEach((e,n)=>{for(const r of n.wa)r.onError(t)})}(this,new Bt(jt.ABORTED,"Firestore shutting down"))}}function sd(){return new _o(e=>go(e),mo)}async function od(e,t){const n=Ut(e);let r=3;const i=t.query;let s=n.queries.get(i);s?!s.Sa()&&t.ba()&&(r=2):(s=new rd,r=t.ba()?0:1);try{switch(r){case 0:s.ya=await n.onListen(i,!0);break;case 1:s.ya=await n.onListen(i,!1);break;case 2:await n.onFirstRemoteStoreListen(i)}}catch(o){const e=Zh(o,`Initialization of query '${yo(t.query)}' failed`);return void t.onError(e)}n.queries.set(i,s),s.wa.push(t),t.va(n.onlineState),s.ya&&t.Ca(s.ya)&&ld(n)}async function ad(e,t){const n=Ut(e),r=t.query;let i=3;const s=n.queries.get(r);if(s){const e=s.wa.indexOf(t);e>=0&&(s.wa.splice(e,1),0===s.wa.length?i=t.ba()?0:1:!s.Sa()&&t.ba()&&(i=2))}switch(i){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function cd(e,t){const n=Ut(e);let r=!1;for(const i of t){const e=i.query,t=n.queries.get(e);if(t){for(const e of t.wa)e.Ca(i)&&(r=!0);t.ya=i}}r&&ld(n)}function ud(e,t,n){const r=Ut(e),i=r.queries.get(t);if(i)for(const s of i.wa)s.onError(n);r.queries.delete(t)}function ld(e){e.Da.forEach(e=>{e.next()})}var hd,dd;(dd=hd||(hd={})).Fa="default",dd.Cache="cache";class fd{constructor(e,t,n){this.query=e,this.Ma=t,this.xa=!1,this.Oa=null,this.onlineState="Unknown",this.options=n||{}}Ca(e){if(!this.options.includeMetadataChanges){const t=[];for(const n of e.docChanges)3!==n.type&&t.push(n);e=new nd(e.query,e.docs,e.oldDocs,t,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.xa?this.Na(e)&&(this.Ma.next(e),t=!0):this.Ba(e,this.onlineState)&&(this.La(e),t=!0),this.Oa=e,t}onError(e){this.Ma.error(e)}va(e){this.onlineState=e;let t=!1;return this.Oa&&!this.xa&&this.Ba(this.Oa,e)&&(this.La(this.Oa),t=!0),t}Ba(e,t){if(!e.fromCache)return!0;if(!this.ba())return!0;const n="Offline"!==t;return(!this.options.ka||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||"Offline"===t)}Na(e){if(e.docChanges.length>0)return!0;const t=this.Oa&&this.Oa.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&!0===this.options.includeMetadataChanges}La(e){e=nd.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.xa=!0,this.Ma.next(e)}ba(){return this.options.source!==hd.Cache}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pd{constructor(e,t){this.qa=e,this.byteLength=t}Qa(){return"metadata"in this.qa}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class md{constructor(e){this.serializer=e}Qs(e){return Xa(this.serializer,e)}$s(e){return e.metadata.exists?rc(this.serializer,e.document,!1):Es.newNoDocument(this.Qs(e.metadata.name),this.Us(e.metadata.readTime))}Us(e){return Ga(e)}}class gd{constructor(e,t){this.$a=e,this.serializer=t,this.Ua=[],this.Ka=[],this.collectionGroups=new Set,this.progress=yd(e)}get queries(){return this.Ua}get documents(){return this.Ka}Wa(e){this.progress.bytesLoaded+=e.byteLength;let t=this.progress.documentsLoaded;if(e.qa.namedQuery)this.Ua.push(e.qa.namedQuery);else if(e.qa.documentMetadata){this.Ka.push({metadata:e.qa.documentMetadata}),e.qa.documentMetadata.exists||++t;const n=un.fromString(e.qa.documentMetadata.name);this.collectionGroups.add(n.get(n.length-2))}else e.qa.document&&(this.Ka[this.Ka.length-1].document=e.qa.document,++t);return t!==this.progress.documentsLoaded?(this.progress.documentsLoaded=t,Object.assign({},this.progress)):null}Ga(e){const t=new Map,n=new md(this.serializer);for(const r of e)if(r.metadata.queries){const e=n.Qs(r.metadata.name);for(const n of r.metadata.queries){const r=(t.get(n)||Oo()).add(e);t.set(n,r)}}return t}async za(e){const t=await async function(e,t,n,r){const i=Ut(e);let s=Oo(),o=Eo();for(const l of n){const e=t.Qs(l.metadata.name);l.document&&(s=s.add(e));const n=t.$s(l);n.setReadTime(t.Us(l.metadata.readTime)),o=o.insert(e,n)}const a=i.Os.newChangeBuffer({trackRemovals:!0}),c=await Rl(i,(u=r,uo(so(un.fromString(`__bundle__/docs/${u}`)))));var u;return i.persistence.runTransaction("Apply bundle documents","readwrite",e=>Dl(e,a,o).next(t=>(a.apply(e),t)).next(t=>i.hi.removeMatchingKeysForTargetId(e,c.targetId).next(()=>i.hi.addMatchingKeys(e,s,c.targetId)).next(()=>i.localDocuments.getLocalViewOfDocuments(e,t.Ls,t.ks)).next(()=>t.Ls)))}(e,new md(this.serializer),this.Ka,this.$a.id),n=this.Ga(this.documents);for(const r of this.Ua)await Vl(e,r,n.get(r.name));return this.progress.taskState="Success",{progress:this.progress,ja:this.collectionGroups,Ja:t}}}function yd(e){return{taskState:"Running",documentsLoaded:0,bytesLoaded:0,totalDocuments:e.totalDocuments,totalBytes:e.totalBytes}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vd{constructor(e){this.key=e}}class wd{constructor(e){this.key=e}}class bd{constructor(e,t){this.query=e,this.Ha=t,this.Ya=null,this.hasCachedResults=!1,this.current=!1,this.Za=Oo(),this.mutatedKeys=Oo(),this.Xa=bo(e),this.eu=new ed(this.Xa)}get tu(){return this.Ha}nu(e,t){const n=t?t.ru:new td,r=t?t.eu:this.eu;let i=t?t.mutatedKeys:this.mutatedKeys,s=r,o=!1;const a="F"===this.query.limitType&&r.size===this.query.limit?r.last():null,c="L"===this.query.limitType&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal((e,t)=>{const u=r.get(e),l=vo(this.query,t)?t:null,h=!!u&&this.mutatedKeys.has(u.key),d=!!l&&(l.hasLocalMutations||this.mutatedKeys.has(l.key)&&l.hasCommittedMutations);let f=!1;u&&l?u.data.isEqual(l.data)?h!==d&&(n.track({type:3,doc:l}),f=!0):this.iu(u,l)||(n.track({type:2,doc:l}),f=!0,(a&&this.Xa(l,a)>0||c&&this.Xa(l,c)<0)&&(o=!0)):!u&&l?(n.track({type:0,doc:l}),f=!0):u&&!l&&(n.track({type:1,doc:u}),f=!0,(a||c)&&(o=!0)),f&&(l?(s=s.add(l),i=d?i.add(e):i.delete(e)):(s=s.delete(e),i=i.delete(e)))}),null!==this.query.limit)for(;s.size>this.query.limit;){const e="F"===this.query.limitType?s.last():s.first();s=s.delete(e.key),i=i.delete(e.key),n.track({type:1,doc:e})}return{eu:s,ru:n,Ds:o,mutatedKeys:i}}iu(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,r){const i=this.eu;this.eu=e.eu,this.mutatedKeys=e.mutatedKeys;const s=e.ru.pa();s.sort((e,t)=>function(e,t){const n=e=>{switch(e){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Mt(20277,{At:e})}};return n(e)-n(t)}(e.type,t.type)||this.Xa(e.doc,t.doc)),this.su(n),r=null!=r&&r;const o=t&&!r?this.ou():[],a=0===this.Za.size&&this.current&&!r?1:0,c=a!==this.Ya;return this.Ya=a,0!==s.length||c?{snapshot:new nd(this.query,e.eu,i,s,e.mutatedKeys,0===a,c,!1,!!n&&n.resumeToken.approximateByteSize()>0),_u:o}:{_u:o}}va(e){return this.current&&"Offline"===e?(this.current=!1,this.applyChanges({eu:this.eu,ru:new td,mutatedKeys:this.mutatedKeys,Ds:!1},!1)):{_u:[]}}au(e){return!this.Ha.has(e)&&!!this.eu.has(e)&&!this.eu.get(e).hasLocalMutations}su(e){e&&(e.addedDocuments.forEach(e=>this.Ha=this.Ha.add(e)),e.modifiedDocuments.forEach(e=>{}),e.removedDocuments.forEach(e=>this.Ha=this.Ha.delete(e)),this.current=e.current)}ou(){if(!this.current)return[];const e=this.Za;this.Za=Oo(),this.eu.forEach(e=>{this.au(e.key)&&(this.Za=this.Za.add(e.key))});const t=[];return e.forEach(e=>{this.Za.has(e)||t.push(new wd(e))}),this.Za.forEach(n=>{e.has(n)||t.push(new vd(n))}),t}uu(e){this.Ha=e.qs,this.Za=Oo();const t=this.nu(e.documents);return this.applyChanges(t,!0)}cu(){return nd.fromInitialDocuments(this.query,this.eu,this.mutatedKeys,0===this.Ya,this.hasCachedResults)}}const Id="SyncEngine";class _d{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class Td{constructor(e){this.key=e,this.lu=!1}}class Ed{constructor(e,t,n,r,i,s){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=r,this.currentUser=i,this.maxConcurrentLimboResolutions=s,this.hu={},this.Pu=new _o(e=>go(e),mo),this.Tu=new Map,this.Iu=new Set,this.du=new Ei(dn.comparator),this.Eu=new Map,this.Au=new tl,this.Ru={},this.Vu=new Map,this.mu=Au.ur(),this.onlineState="Unknown",this.fu=void 0}get isPrimaryClient(){return!0===this.fu}}async function Sd(e,t,n=!0){const r=ef(e);let i;const s=r.Pu.get(t);return s?(r.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.cu()):i=await Ad(r,t,n,!0),i}async function Cd(e,t){const n=ef(e);await Ad(n,t,!0,!1)}async function Ad(e,t,n,r){const i=await Rl(e.localStore,uo(t)),s=i.targetId,o=e.sharedClientState.addLocalQueryTarget(s,n);let a;return r&&(a=await kd(e,t,s,"current"===o,i.resumeToken)),e.isPrimaryClient&&n&&Sh(e.remoteStore,i),a}async function kd(e,t,n,r,i){e.gu=(t,n,r)=>async function(e,t,n,r){let i=t.view.nu(n);i.Ds&&(i=await Pl(e.localStore,t.query,!1).then(({documents:e})=>t.view.nu(e,i)));const s=r&&r.targetChanges.get(t.targetId),o=r&&null!=r.targetMismatches.get(t.targetId),a=t.view.applyChanges(i,e.isPrimaryClient,s,o);return jd(e,t.targetId,a._u),a.snapshot}(e,t,n,r);const s=await Pl(e.localStore,t,!0),o=new bd(t,s.qs),a=o.nu(s.documents),c=Da.createSynthesizedTargetChangeForCurrentChange(n,r&&"Offline"!==e.onlineState,i),u=o.applyChanges(a,e.isPrimaryClient,c);jd(e,n,u._u);const l=new _d(t,n,o);return e.Pu.set(t,l),e.Tu.has(n)?e.Tu.get(n).push(t):e.Tu.set(n,[t]),u.snapshot}async function Nd(e,t,n){const r=Ut(e),i=r.Pu.get(t),s=r.Tu.get(i.targetId);if(s.length>1)return r.Tu.set(i.targetId,s.filter(e=>!mo(e,t))),void r.Pu.delete(t);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(i.targetId),r.sharedClientState.isActiveQueryTarget(i.targetId)||await Ol(r.localStore,i.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(i.targetId),n&&Ch(r.remoteStore,i.targetId),Vd(r,i.targetId)}).catch(Bn)):(Vd(r,i.targetId),await Ol(r.localStore,i.targetId,!0))}async function Dd(e,t){const n=Ut(e),r=n.Pu.get(t),i=n.Tu.get(r.targetId);n.isPrimaryClient&&1===i.length&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),Ch(n.remoteStore,r.targetId))}async function xd(e,t){const n=Ut(e);try{const e=await function(e,t){const n=Ut(e),r=t.snapshotVersion;let i=n.Fs;return n.persistence.runTransaction("Apply remote event","readwrite-primary",e=>{const s=n.Os.newChangeBuffer({trackRemovals:!0});i=n.Fs;const o=[];t.targetChanges.forEach((s,a)=>{const c=i.get(a);if(!c)return;o.push(n.hi.removeMatchingKeys(e,s.removedDocuments,a).next(()=>n.hi.addMatchingKeys(e,s.addedDocuments,a)));let u=c.withSequenceNumber(e.currentSequenceNumber);var l,h,d;null!==t.targetMismatches.get(a)?u=u.withResumeToken(Ri.EMPTY_BYTE_STRING,Cn.min()).withLastLimboFreeSnapshotVersion(Cn.min()):s.resumeToken.approximateByteSize()>0&&(u=u.withResumeToken(s.resumeToken,r)),i=i.insert(a,u),h=u,d=s,(0===(l=c).resumeToken.approximateByteSize()||h.snapshotVersion.toMicroseconds()-l.snapshotVersion.toMicroseconds()>=3e8||d.addedDocuments.size+d.modifiedDocuments.size+d.removedDocuments.size>0)&&o.push(n.hi.updateTargetData(e,u))});let a=Eo(),c=Oo();if(t.documentUpdates.forEach(r=>{t.resolvedLimboDocuments.has(r)&&o.push(n.persistence.referenceDelegate.updateLimboDocument(e,r))}),o.push(Dl(e,s,t.documentUpdates).next(e=>{a=e.Ls,c=e.ks})),!r.isEqual(Cn.min())){const t=n.hi.getLastRemoteSnapshotVersion(e).next(t=>n.hi.setTargetsMetadata(e,e.currentSequenceNumber,r));o.push(t)}return qn.waitFor(o).next(()=>s.apply(e)).next(()=>n.localDocuments.getLocalViewOfDocuments(e,a,c)).next(()=>a)}).then(e=>(n.Fs=i,e))}(n.localStore,t);t.targetChanges.forEach((e,t)=>{const r=n.Eu.get(t);r&&(Vt(e.addedDocuments.size+e.modifiedDocuments.size+e.removedDocuments.size<=1,22616),e.addedDocuments.size>0?r.lu=!0:e.modifiedDocuments.size>0?Vt(r.lu,14607):e.removedDocuments.size>0&&(Vt(r.lu,42227),r.lu=!1))}),await zd(n,e,t)}catch(r){await Bn(r)}}function Rd(e,t,n){const r=Ut(e);if(r.isPrimaryClient&&0===n||!r.isPrimaryClient&&1===n){const e=[];r.Pu.forEach((n,r)=>{const i=r.view.va(t);i.snapshot&&e.push(i.snapshot)}),function(e,t){const n=Ut(e);n.onlineState=t;let r=!1;n.queries.forEach((e,n)=>{for(const i of n.wa)i.va(t)&&(r=!0)}),r&&ld(n)}(r.eventManager,t),e.length&&r.hu.J_(e),r.onlineState=t,r.isPrimaryClient&&r.sharedClientState.setOnlineState(t)}}async function Od(e,t,n){const r=Ut(e);r.sharedClientState.updateQueryState(t,"rejected",n);const i=r.Eu.get(t),s=i&&i.key;if(s){let e=new Ei(dn.comparator);e=e.insert(s,Es.newNoDocument(s,Cn.min()));const n=Oo().add(s),i=new Na(Cn.min(),new Map,new Ei(en),e,n);await xd(r,i),r.du=r.du.remove(s),r.Eu.delete(t),qd(r)}else await Ol(r.localStore,t,!1).then(()=>Vd(r,t,n)).catch(Bn)}async function Pd(e,t){const n=Ut(e),r=t.batch.batchId;try{const e=await function(e,t){const n=Ut(e);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",e=>{const r=t.batch.keys(),i=n.Os.newChangeBuffer({trackRemovals:!0});return function(e,t,n,r){const i=n.batch,s=i.keys();let o=qn.resolve();return s.forEach(e=>{o=o.next(()=>r.getEntry(t,e)).next(t=>{const s=n.docVersions.get(e);Vt(null!==s,48541),t.version.compareTo(s)<0&&(i.applyToRemoteDocument(t,n),t.isValidDocument()&&(t.setReadTime(n.commitVersion),r.addEntry(t)))})}),o.next(()=>e.mutationQueue.removeMutationBatch(t,i))}(n,e,t,i).next(()=>i.apply(e)).next(()=>n.mutationQueue.performConsistencyCheck(e)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(e,r,t.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,function(e){let t=Oo();for(let n=0;n<e.mutationResults.length;++n)e.mutationResults[n].transformResults.length>0&&(t=t.add(e.batch.mutations[n].key));return t}(t))).next(()=>n.localDocuments.getDocuments(e,r))})}(n.localStore,t);Fd(n,r,null),Md(n,r),n.sharedClientState.updateMutationState(r,"acknowledged"),await zd(n,e)}catch(i){await Bn(i)}}async function Ld(e,t,n){const r=Ut(e);try{const e=await function(e,t){const n=Ut(e);return n.persistence.runTransaction("Reject batch","readwrite-primary",e=>{let r;return n.mutationQueue.lookupMutationBatch(e,t).next(t=>(Vt(null!==t,37113),r=t.keys(),n.mutationQueue.removeMutationBatch(e,t))).next(()=>n.mutationQueue.performConsistencyCheck(e)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(e,r,t)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,r)).next(()=>n.localDocuments.getDocuments(e,r))})}(r.localStore,t);Fd(r,t,n),Md(r,t),r.sharedClientState.updateMutationState(t,"rejected",n),await zd(r,e)}catch(i){await Bn(i)}}function Md(e,t){(e.Vu.get(t)||[]).forEach(e=>{e.resolve()}),e.Vu.delete(t)}function Fd(e,t,n){const r=Ut(e);let i=r.Ru[r.currentUser.toKey()];if(i){const e=i.get(t);e&&(n?e.reject(n):e.resolve(),i=i.remove(t)),r.Ru[r.currentUser.toKey()]=i}}function Vd(e,t,n=null){e.sharedClientState.removeLocalQueryTarget(t);for(const r of e.Tu.get(t))e.Pu.delete(r),n&&e.hu.pu(r,n);e.Tu.delete(t),e.isPrimaryClient&&e.Au.zr(t).forEach(t=>{e.Au.containsKey(t)||Ud(e,t)})}function Ud(e,t){e.Iu.delete(t.path.canonicalString());const n=e.du.get(t);null!==n&&(Ch(e.remoteStore,n),e.du=e.du.remove(t),e.Eu.delete(n),qd(e))}function jd(e,t,n){for(const r of n)r instanceof vd?(e.Au.addReference(r.key,t),Bd(e,r)):r instanceof wd?(Rt(Id,"Document no longer in limbo: "+r.key),e.Au.removeReference(r.key,t),e.Au.containsKey(r.key)||Ud(e,r.key)):Mt(19791,{yu:r})}function Bd(e,t){const n=t.key,r=n.path.canonicalString();e.du.get(n)||e.Iu.has(r)||(Rt(Id,"New document in limbo: "+n),e.Iu.add(r),qd(e))}function qd(e){for(;e.Iu.size>0&&e.du.size<e.maxConcurrentLimboResolutions;){const t=e.Iu.values().next().value;e.Iu.delete(t);const n=new dn(un.fromString(t)),r=e.mu.next();e.Eu.set(r,new Td(n)),e.du=e.du.insert(n,r),Sh(e.remoteStore,new wc(uo(so(n.path)),r,"TargetPurposeLimboResolution",rr.ue))}}async function zd(e,t,n){const r=Ut(e),i=[],s=[],o=[];r.Pu.isEmpty()||(r.Pu.forEach((e,a)=>{o.push(r.gu(a,t,n).then(e=>{var t;if((e||n)&&r.isPrimaryClient){const i=e?!e.fromCache:null===(t=null==n?void 0:n.targetChanges.get(a.targetId))||void 0===t?void 0:t.current;r.sharedClientState.updateQueryState(a.targetId,i?"current":"not-current")}if(e){i.push(e);const t=_l.Es(a.targetId,e);s.push(t)}}))}),await Promise.all(o),r.hu.J_(i),await async function(e,t){const n=Ut(e);try{await n.persistence.runTransaction("notifyLocalViewChanges","readwrite",e=>qn.forEach(t,t=>qn.forEach(t.Is,r=>n.persistence.referenceDelegate.addReference(e,t.targetId,r)).next(()=>qn.forEach(t.ds,r=>n.persistence.referenceDelegate.removeReference(e,t.targetId,r)))))}catch(r){if(!Qn(r))throw r;Rt(Sl,"Failed to update sequence numbers: "+r)}for(const i of t){const e=i.targetId;if(!i.fromCache){const t=n.Fs.get(e),r=t.snapshotVersion,i=t.withLastLimboFreeSnapshotVersion(r);n.Fs=n.Fs.insert(e,i)}}}(r.localStore,s))}async function $d(e,t){const n=Ut(e);if(!n.currentUser.isEqual(t)){Rt(Id,"User change. New user:",t.toKey());const e=await kl(n.localStore,t);n.currentUser=t,i="'waitForPendingWrites' promise is rejected due to a user change.",(r=n).Vu.forEach(e=>{e.forEach(e=>{e.reject(new Bt(jt.CANCELLED,i))})}),r.Vu.clear(),n.sharedClientState.handleUserChange(t,e.removedBatchIds,e.addedBatchIds),await zd(n,e.Bs)}var r,i}function Kd(e,t){const n=Ut(e),r=n.Eu.get(t);if(r&&r.lu)return Oo().add(r.key);{let e=Oo();const r=n.Tu.get(t);if(!r)return e;for(const t of r){const r=n.Pu.get(t);e=e.unionWith(r.view.tu)}return e}}async function Gd(e,t){const n=Ut(e),r=await Pl(n.localStore,t.query,!0),i=t.view.uu(r);return n.isPrimaryClient&&jd(n,t.targetId,i._u),i}async function Hd(e,t){const n=Ut(e);return Ml(n.localStore,t).then(e=>zd(n,e))}async function Wd(e,t,n,r){const i=Ut(e),s=await function(e,t){const n=Ut(e),r=Ut(n.mutationQueue);return n.persistence.runTransaction("Lookup mutation documents","readonly",e=>r.Xn(e,t).next(t=>t?n.localDocuments.getDocuments(e,t):qn.resolve(null)))}(i.localStore,t);var o,a;null!==s?("pending"===n?await Uh(i.remoteStore):"acknowledged"===n||"rejected"===n?(Fd(i,t,r||null),Md(i,t),o=i.localStore,a=t,Ut(Ut(o).mutationQueue).rr(a)):Mt(6720,"Unknown batchState",{wu:n}),await zd(i,s)):Rt(Id,"Cannot apply mutation batch with id: "+t)}async function Qd(e,t,n){const r=Ut(e),i=[],s=[];for(const o of t){let e;const t=r.Tu.get(o);if(t&&0!==t.length){e=await Rl(r.localStore,uo(t[0]));for(const e of t){const t=r.Pu.get(e),n=await Gd(r,t);n.snapshot&&s.push(n.snapshot)}}else{const t=await Ll(r.localStore,o);e=await Rl(r.localStore,t),await kd(r,Jd(t),o,!1,e.resumeToken)}i.push(e)}return r.hu.J_(s),i}function Jd(e){return io(e.path,e.collectionGroup,e.orderBy,e.filters,e.limit,"F",e.startAt,e.endAt)}function Xd(e){return t=Ut(e).localStore,Ut(Ut(t).persistence).Ps();var t}async function Yd(e,t,n,r){const i=Ut(e);if(i.fu)return void Rt(Id,"Ignoring unexpected query state notification.");const s=i.Tu.get(t);if(s&&s.length>0)switch(n){case"current":case"not-current":{const e=await Ml(i.localStore,wo(s[0])),r=Na.createSynthesizedRemoteEventForCurrentChange(t,"current"===n,Ri.EMPTY_BYTE_STRING);await zd(i,e,r);break}case"rejected":await Ol(i.localStore,t,!0),Vd(i,t,r);break;default:Mt(64155,n)}}async function Zd(e,t,n){const r=ef(e);if(r.fu){for(const e of t){if(r.Tu.has(e)&&r.sharedClientState.isActiveQueryTarget(e)){Rt(Id,"Adding an already active target "+e);continue}const t=await Ll(r.localStore,e),n=await Rl(r.localStore,t);await kd(r,Jd(t),n.targetId,!1,n.resumeToken),Sh(r.remoteStore,n)}for(const e of n)r.Tu.has(e)&&await Ol(r.localStore,e,!1).then(()=>{Ch(r.remoteStore,e),Vd(r,e)}).catch(Bn)}}function ef(e){const t=Ut(e);return t.remoteStore.remoteSyncer.applyRemoteEvent=xd.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=Kd.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=Od.bind(null,t),t.hu.J_=cd.bind(null,t.eventManager),t.hu.pu=ud.bind(null,t.eventManager),t}function tf(e){const t=Ut(e);return t.remoteStore.remoteSyncer.applySuccessfulWrite=Pd.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=Ld.bind(null,t),t}class nf{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=dh(e.databaseInfo.databaseId),this.sharedClientState=this.bu(e),this.persistence=this.Du(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Cu(e,this.localStore),this.indexBackfillerScheduler=this.Fu(e,this.localStore)}Cu(e,t){return null}Fu(e,t){return null}vu(e){return Al(this.persistence,new El,e.initialUser,this.serializer)}Du(e){return new al(ul.Vi,this.serializer)}bu(e){return new Yl}async terminate(){var e,t;null===(e=this.gcScheduler)||void 0===e||e.stop(),null===(t=this.indexBackfillerScheduler)||void 0===t||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}nf.provider={build:()=>new nf};class rf extends nf{constructor(e){super(),this.cacheSizeBytes=e}Cu(e,t){Vt(this.persistence.referenceDelegate instanceof ll,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new Mu(n,e.asyncQueue,t)}Du(e){const t=void 0!==this.cacheSizeBytes?wu.withCacheSize(this.cacheSizeBytes):wu.DEFAULT;return new al(e=>ll.Vi(e,t),this.serializer)}}class sf extends nf{constructor(e,t,n){super(),this.Mu=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.Mu.initialize(this,e),await tf(this.Mu.syncEngine),await Uh(this.Mu.remoteStore),await this.persistence.ji(()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve()))}vu(e){return Al(this.persistence,new El,e.initialUser,this.serializer)}Cu(e,t){const n=this.persistence.referenceDelegate.garbageCollector;return new Mu(n,e.asyncQueue,t)}Fu(e,t){const n=new nr(t,this.persistence);return new tr(e.asyncQueue,n)}Du(e){const t=Il(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),n=void 0!==this.cacheSizeBytes?wu.withCacheSize(this.cacheSizeBytes):wu.DEFAULT;return new vl(this.synchronizeTabs,t,e.clientId,n,e.asyncQueue,lh(),hh(),this.serializer,this.sharedClientState,!!this.forceOwnership)}bu(e){return new Yl}}class of extends sf{constructor(e,t){super(e,t,!1),this.Mu=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);const t=this.Mu.syncEngine;this.sharedClientState instanceof Xl&&(this.sharedClientState.syncEngine={Do:Wd.bind(null,t),vo:Yd.bind(null,t),Co:Zd.bind(null,t),Ps:Xd.bind(null,t),bo:Hd.bind(null,t)},await this.sharedClientState.start()),await this.persistence.ji(async e=>{await async function(e,t){const n=Ut(e);if(ef(n),tf(n),!0===t&&!0!==n.fu){const e=n.sharedClientState.getAllActiveQueryTargets(),t=await Qd(n,e.toArray());n.fu=!0,await Qh(n.remoteStore,!0);for(const r of t)Sh(n.remoteStore,r)}else if(!1===t&&!1!==n.fu){const e=[];let t=Promise.resolve();n.Tu.forEach((r,i)=>{n.sharedClientState.isLocalQueryTarget(i)?e.push(i):t=t.then(()=>(Vd(n,i),Ol(n.localStore,i,!0))),Ch(n.remoteStore,i)}),await t,await Qd(n,e),function(e){const t=Ut(e);t.Eu.forEach((e,n)=>{Ch(t.remoteStore,n)}),t.Au.jr(),t.Eu=new Map,t.du=new Ei(dn.comparator)}(n),n.fu=!1,await Qh(n.remoteStore,!1)}}(this.Mu.syncEngine,e),this.gcScheduler&&(e&&!this.gcScheduler.started?this.gcScheduler.start():e||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(e&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():e||this.indexBackfillerScheduler.stop())})}bu(e){const t=lh();if(!Xl.C(t))throw new Bt(jt.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const n=Il(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new Xl(t,e.asyncQueue,n,e.clientId,e.initialUser)}}class af{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=e=>Rd(this.syncEngine,e,1),this.remoteStore.remoteSyncer.handleCredentialChange=$d.bind(null,this.syncEngine),await Qh(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return new id}createDatastore(e){const t=dh(e.databaseInfo.databaseId),n=(r=e.databaseInfo,new uh(r));var r;return function(e,t,n,r){return new wh(e,t,n,r)}(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return t=this.localStore,n=this.datastore,r=e.asyncQueue,i=e=>Rd(this.syncEngine,e,0),s=th.C()?new th:new Zl,new _h(t,n,r,i,s);var t,n,r,i,s}createSyncEngine(e,t){return function(e,t,n,r,i,s,o){const a=new Ed(e,t,n,r,i,s);return o&&(a.fu=!0),a}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(e){const t=Ut(e);Rt(Ih,"RemoteStore shutting down."),t.Ia.add(5),await Eh(t),t.Ea.shutdown(),t.Aa.set("Unknown")}(this.remoteStore),null===(e=this.datastore)||void 0===e||e.terminate(),null===(t=this.eventManager)||void 0===t||t.terminate()}}function cf(e,t=10240){let n=0;return{async read(){if(n<e.byteLength){const r={value:e.slice(n,n+t),done:!1};return n+=t,r}return{done:!0}},async cancel(){},releaseLock(){},closed:Promise.resolve()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */af.provider={build:()=>new af};class uf{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.xu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.xu(this.observer.error,e):Ot("Uncaught Error in snapshot listener:",e.toString()))}Ou(){this.muted=!0}xu(e,t){setTimeout(()=>{this.muted||e(t)},0)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lf{constructor(e,t){this.Nu=e,this.serializer=t,this.metadata=new qt,this.buffer=new Uint8Array,this.Bu=new TextDecoder("utf-8"),this.Lu().then(e=>{e&&e.Qa()?this.metadata.resolve(e.qa.metadata):this.metadata.reject(new Error(`The first element of the bundle is not a metadata, it is\n             ${JSON.stringify(null==e?void 0:e.qa)}`))},e=>this.metadata.reject(e))}close(){return this.Nu.cancel()}async getMetadata(){return this.metadata.promise}async Su(){return await this.getMetadata(),this.Lu()}async Lu(){const e=await this.ku();if(null===e)return null;const t=this.Bu.decode(e),n=Number(t);isNaN(n)&&this.qu(`length string (${t}) is not valid number`);const r=await this.Qu(n);return new pd(JSON.parse(r),e.length+n)}$u(){return this.buffer.findIndex(e=>e==="{".charCodeAt(0))}async ku(){for(;this.$u()<0&&!(await this.Uu()););if(0===this.buffer.length)return null;const e=this.$u();e<0&&this.qu("Reached the end of bundle when a length string is expected.");const t=this.buffer.slice(0,e);return this.buffer=this.buffer.slice(e),t}async Qu(e){for(;this.buffer.length<e;)await this.Uu()&&this.qu("Reached the end of bundle when more is expected.");const t=this.Bu.decode(this.buffer.slice(0,e));return this.buffer=this.buffer.slice(e),t}qu(e){throw this.Nu.cancel(),new Error(`Invalid bundle format: ${e}`)}async Uu(){const e=await this.Nu.read();if(!e.done){const t=new Uint8Array(this.buffer.length+e.value.length);t.set(this.buffer),t.set(e.value,this.buffer.length),this.buffer=t}return e.done}}
/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hf{constructor(e,t){this.bundleData=e,this.serializer=t,this.cursor=0,this.elements=[];let n=this.Su();if(!n||!n.Qa())throw new Error(`The first element of the bundle is not a metadata object, it is\n         ${JSON.stringify(null==n?void 0:n.qa)}`);this.metadata=n;do{n=this.Su(),null!==n&&this.elements.push(n)}while(null!==n)}getMetadata(){return this.metadata}Ku(){return this.elements}Su(){if(this.cursor===this.bundleData.length)return null;const e=this.ku(),t=this.Qu(e);return new pd(JSON.parse(t),e)}Qu(e){if(this.cursor+e>this.bundleData.length)throw new Bt(jt.INTERNAL,"Reached the end of bundle when more is expected.");return this.bundleData.slice(this.cursor,this.cursor+=e)}ku(){const e=this.cursor;let t=this.cursor;for(;t<this.bundleData.length;){if("{"===this.bundleData[t]){if(t===e)throw new Error("First character is a bracket and not a number");return this.cursor=t,Number(this.bundleData.slice(e,t))}t++}throw new Error("Reached the end of bundle when more is expected.")}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class df{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new Bt(jt.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const t=await async function(e,t){const n=Ut(e),r={documents:t.map(e=>Ja(n.serializer,e))},i=await n.Jo("BatchGetDocuments",n.serializer.databaseId,un.emptyPath(),r,t.length),s=new Map;i.forEach(e=>{const t=function(e,t){return"found"in t?function(e,t){Vt(!!t.found,43571),t.found.name,t.found.updateTime;const n=Xa(e,t.found.name),r=Ga(t.found.updateTime),i=t.found.createTime?Ga(t.found.createTime):Cn.min(),s=new _s({mapValue:{fields:t.found.fields}});return Es.newFoundDocument(n,r,i,s)}(e,t):"missing"in t?function(e,t){Vt(!!t.missing,3894),Vt(!!t.readTime,22933);const n=Xa(e,t.missing),r=Ga(t.readTime);return Es.newNoDocument(n,r)}(e,t):Mt(7234,{result:t})}(n.serializer,e);s.set(t.key.toString(),t)});const o=[];return t.forEach(e=>{const t=s.get(e.toString());Vt(!!t,55234,{key:e}),o.push(t)}),o}(this.datastore,e);return t.forEach(e=>this.recordVersion(e)),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(n){this.lastTransactionError=n}this.writtenDocs.add(e.toString())}delete(e){this.write(new da(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach(t=>{e.delete(t.key.toString())}),e.forEach((e,t)=>{const n=dn.fromPath(t);this.mutations.push(new fa(n,this.precondition(n)))}),await async function(e,t){const n=Ut(e),r={writes:t.map(e=>ic(n.serializer,e))};await n.Wo("Commit",n.serializer.databaseId,un.emptyPath(),r)}(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw Mt(50498,{Wu:e.constructor.name});t=Cn.min()}const n=this.readVersions.get(e.key.toString());if(n){if(!t.isEqual(n))throw new Bt(jt.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(Cn.min())?Zo.exists(!1):Zo.updateTime(t):Zo.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(Cn.min()))throw new Bt(jt.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return Zo.updateTime(t)}return Zo.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ff{constructor(e,t,n,r,i){this.asyncQueue=e,this.datastore=t,this.options=n,this.updateFunction=r,this.deferred=i,this.Gu=n.maxAttempts,this.F_=new fh(this.asyncQueue,"transaction_retry")}zu(){this.Gu-=1,this.ju()}ju(){this.F_.g_(async()=>{const e=new df(this.datastore),t=this.Ju(e);t&&t.then(t=>{this.asyncQueue.enqueueAndForget(()=>e.commit().then(()=>{this.deferred.resolve(t)}).catch(e=>{this.Hu(e)}))}).catch(e=>{this.Hu(e)})})}Ju(e){try{const t=this.updateFunction(e);return!sr(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}Hu(e){this.Gu>0&&this.Yu(e)?(this.Gu-=1,this.asyncQueue.enqueueAndForget(()=>(this.ju(),Promise.resolve()))):this.deferred.reject(e)}Yu(e){if("FirebaseError"===e.name){const t=e.code;return"aborted"===t||"failed-precondition"===t||"already-exists"===t||!Ia(t)}return!1}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pf="FirestoreClient";class mf{constructor(e,t,n,r,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this.databaseInfo=r,this.user=kt.UNAUTHENTICATED,this.clientId=Zt.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,async e=>{Rt(pf,"Received user=",e.uid),await this.authCredentialListener(e),this.user=e}),this.appCheckCredentials.start(n,e=>(Rt(pf,"Received new app check token=",e),this.appCheckCredentialListener(e,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new qt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=Zh(t,"Failed to shutdown persistence");e.reject(n)}}),e.promise}}async function gf(e,t){e.asyncQueue.verifyOperationInProgress(),Rt(pf,"Initializing OfflineComponentProvider");const n=e.configuration;await t.initialize(n);let r=n.initialUser;e.setCredentialChangeListener(async e=>{r.isEqual(e)||(await kl(t.localStore,e),r=e)}),t.persistence.setDatabaseDeletedListener(()=>{Pt("Terminating Firestore due to IndexedDb database deletion"),e.terminate().then(()=>{Rt("Terminating Firestore due to IndexedDb database deletion completed successfully")}).catch(e=>{Pt("Terminating Firestore due to IndexedDb database deletion failed",e)})}),e._offlineComponents=t}async function yf(e,t){e.asyncQueue.verifyOperationInProgress();const n=await vf(e);Rt(pf,"Initializing OnlineComponentProvider"),await t.initialize(n,e.configuration),e.setCredentialChangeListener(e=>Wh(t.remoteStore,e)),e.setAppCheckTokenChangeListener((e,n)=>Wh(t.remoteStore,n)),e._onlineComponents=t}async function vf(e){if(!e._offlineComponents)if(e._uninitializedComponentsProvider){Rt(pf,"Using user provided OfflineComponentProvider");try{await gf(e,e._uninitializedComponentsProvider._offline)}catch(n){const r=n;if(!("FirebaseError"===(t=r).name?t.code===jt.FAILED_PRECONDITION||t.code===jt.UNIMPLEMENTED:!("undefined"!=typeof DOMException&&t instanceof DOMException)||22===t.code||20===t.code||11===t.code))throw r;Pt("Error using user provided cache. Falling back to memory cache: "+r),await gf(e,new nf)}}else Rt(pf,"Using default OfflineComponentProvider"),await gf(e,new rf(void 0));var t;return e._offlineComponents}async function wf(e){return e._onlineComponents||(e._uninitializedComponentsProvider?(Rt(pf,"Using user provided OnlineComponentProvider"),await yf(e,e._uninitializedComponentsProvider._online)):(Rt(pf,"Using default OnlineComponentProvider"),await yf(e,new af))),e._onlineComponents}function bf(e){return vf(e).then(e=>e.persistence)}function If(e){return vf(e).then(e=>e.localStore)}function _f(e){return wf(e).then(e=>e.remoteStore)}function Tf(e){return wf(e).then(e=>e.syncEngine)}function Ef(e){return wf(e).then(e=>e.datastore)}async function Sf(e){const t=await wf(e),n=t.eventManager;return n.onListen=Sd.bind(null,t.syncEngine),n.onUnlisten=Nd.bind(null,t.syncEngine),n.onFirstRemoteStoreListen=Cd.bind(null,t.syncEngine),n.onLastRemoteStoreUnlisten=Dd.bind(null,t.syncEngine),n}function Cf(e,t,n={}){const r=new qt;return e.asyncQueue.enqueueAndForget(async()=>function(e,t,n,r,i){const s=new uf({next:a=>{s.Ou(),t.enqueueAndForget(()=>ad(e,o));const c=a.docs.has(n);!c&&a.fromCache?i.reject(new Bt(jt.UNAVAILABLE,"Failed to get document because the client is offline.")):c&&a.fromCache&&r&&"server"===r.source?i.reject(new Bt(jt.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):i.resolve(a)},error:e=>i.reject(e)}),o=new fd(so(n.path),s,{includeMetadataChanges:!0,ka:!0});return od(e,o)}(await Sf(e),e.asyncQueue,t,n,r)),r.promise}function Af(e,t,n={}){const r=new qt;return e.asyncQueue.enqueueAndForget(async()=>function(e,t,n,r,i){const s=new uf({next:n=>{s.Ou(),t.enqueueAndForget(()=>ad(e,o)),n.fromCache&&"server"===r.source?i.reject(new Bt(jt.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):i.resolve(n)},error:e=>i.reject(e)}),o=new fd(n,s,{includeMetadataChanges:!0,ka:!0});return od(e,o)}(await Sf(e),e.asyncQueue,t,n,r)),r.promise}function kf(e,t,n,r){const i=function(e,t){let n;return n="string"==typeof e?Yt().encode(e):e,r=function(e,t){if(e instanceof Uint8Array)return cf(e,t);if(e instanceof ArrayBuffer)return cf(new Uint8Array(e),t);if(e instanceof ReadableStream)return e.getReader();throw new Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream")}(n),new lf(r,t);var r}(n,dh(t));e.asyncQueue.enqueueAndForget(async()=>{!function(e,t,n){const r=Ut(e);(async function(e,t,n){try{const i=await t.getMetadata();if(await function(e,t){const n=Ut(e),r=Ga(t.createTime);return n.persistence.runTransaction("hasNewerBundle","readonly",e=>n.Ti.getBundleMetadata(e,t.id)).then(e=>!!e&&e.createTime.compareTo(r)>=0)}(e.localStore,i))return await t.close(),n._completeWith({taskState:"Success",documentsLoaded:(r=i).totalDocuments,bytesLoaded:r.totalBytes,totalDocuments:r.totalDocuments,totalBytes:r.totalBytes}),Promise.resolve(new Set);n._updateProgress(yd(i));const s=new gd(i,t.serializer);let o=await t.Su();for(;o;){const e=await s.Wa(o);e&&n._updateProgress(e),o=await t.Su()}const a=await s.za(e.localStore);return await zd(e,a.Ja,void 0),await function(e,t){const n=Ut(e);return n.persistence.runTransaction("Save bundle","readwrite",e=>n.Ti.saveBundleMetadata(e,t))}(e.localStore,i),n._completeWith(a.progress),Promise.resolve(a.ja)}catch(r){return Pt(Id,`Loading bundle failed with ${r}`),n._failWith(r),Promise.resolve(new Set)}var r})(r,t,n).then(e=>{r.sharedClientState.notifyBundleLoaded(e)})}(await Tf(e),i,r)})}function Nf(e,t){return new hf(e,t)}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Df(e){const t={};return void 0!==e.timeoutSeconds&&(t.timeoutSeconds=e.timeoutSeconds),t
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}const xf=new Map,Rf="firestore.googleapis.com",Of=!0;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pf{constructor(e){var t,n;if(void 0===e.host){if(void 0!==e.ssl)throw new Bt(jt.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Rf,this.ssl=Of}else this.host=e.host,this.ssl=null!==(t=e.ssl)&&void 0!==t?t:Of;if(this.isUsingEmulator=void 0!==e.emulatorOptions,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,void 0===e.cacheSizeBytes)this.cacheSizeBytes=vu;else{if(-1!==e.cacheSizeBytes&&e.cacheSizeBytes<Ou)throw new Bt(jt.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}pn("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:void 0===e.experimentalAutoDetectLongPolling?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Df(null!==(n=e.experimentalLongPollingOptions)&&void 0!==n?n:{}),function(e){if(void 0!==e.timeoutSeconds){if(isNaN(e.timeoutSeconds))throw new Bt(jt.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`);if(e.timeoutSeconds<5)throw new Bt(jt.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`);if(e.timeoutSeconds>30)throw new Bt(jt.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(t=this.experimentalLongPollingOptions,n=e.experimentalLongPollingOptions,t.timeoutSeconds===n.timeoutSeconds)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams;var t,n}}class Lf{constructor(e,t,n,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Pf({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new Bt(jt.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return"notTerminated"!==this._terminateTask}_setSettings(e){if(this._settingsFrozen)throw new Bt(jt.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Pf(e),this._emulatorOptions=e.emulatorOptions||{},void 0!==e.credentials&&(this._authCredentials=function(e){if(!e)return new $t;switch(e.type){case"firstParty":return new Wt(e.sessionIndex||"0",e.iamToken||null,e.authTokenFactory||null);case"provider":return e.client;default:throw new Bt(jt.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return"notTerminated"===this._terminateTask&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){"notTerminated"===this._terminateTask?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){const t=xf.get(e);t&&(Rt("ComponentProvider","Removing Datastore"),xf.delete(e),t.terminate())}(this),Promise.resolve()}}function Mf(e,t,n,r={}){var i;e=wn(e,Lf);const s=f(t),o=e._getSettings(),a=Object.assign(Object.assign({},o),{emulatorOptions:e._getEmulatorOptions()}),c=`${t}:${n}`;s&&(p(`https://${c}`),v("Firestore",!0)),o.host!==Rf&&o.host!==c&&Pt("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const u=Object.assign(Object.assign({},o),{host:c,ssl:s,emulatorOptions:r});if(!D(u,a)&&(e._setSettings(u),r.mockUserToken)){let t,n;if("string"==typeof r.mockUserToken)t=r.mockUserToken,n=kt.MOCK_USER;else{t=m(r.mockUserToken,null===(i=e._app)||void 0===i?void 0:i.options.projectId);const s=r.mockUserToken.sub||r.mockUserToken.user_id;if(!s)throw new Bt(jt.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");n=new kt(s)}e._authCredentials=new Kt(new zt(t,n))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ff{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new Ff(this.firestore,e,this._query)}}class Vf{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Uf(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Vf(this.firestore,e,this._key)}toJSON(){return{type:Vf._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,n){if(_n(t,Vf._jsonSchema))return new Vf(e,n||null,new dn(un.fromString(t.referencePath)))}}Vf._jsonSchemaVersion="firestore/documentReference/1.0",Vf._jsonSchema={type:In("string",Vf._jsonSchemaVersion),referencePath:In("string")};class Uf extends Ff{constructor(e,t,n){super(e,t,so(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Vf(this.firestore,null,new dn(e))}withConverter(e){return new Uf(this.firestore,e,this._path)}}function jf(e,t,...n){if(e=V(e),fn("collection","path",t),e instanceof Lf){const r=un.fromString(t,...n);return gn(r),new Uf(e,null,r)}{if(!(e instanceof Vf||e instanceof Uf))throw new Bt(jt.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=e._path.child(un.fromString(t,...n));return gn(r),new Uf(e.firestore,null,r)}}function Bf(e,t,...n){if(e=V(e),1===arguments.length&&(t=Zt.newId()),fn("doc","path",t),e instanceof Lf){const r=un.fromString(t,...n);return mn(r),new Vf(e,null,new dn(r))}{if(!(e instanceof Vf||e instanceof Uf))throw new Bt(jt.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=e._path.child(un.fromString(t,...n));return mn(r),new Vf(e.firestore,e instanceof Uf?e.converter:null,new dn(r))}}function qf(e,t){return e=V(e),t=V(t),e instanceof Ff&&t instanceof Ff&&e.firestore===t.firestore&&mo(e._query,t._query)&&e.converter===t.converter
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}const zf="AsyncQueue";class $f{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new fh(this,"async_queue_retry"),this.oc=()=>{const e=hh();e&&Rt(zf,"Visibility state changed to "+e.visibilityState),this.F_.y_()},this._c=e;const t=hh();t&&"function"==typeof t.addEventListener&&t.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;const t=hh();t&&"function"==typeof t.removeEventListener&&t.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise(()=>{});const t=new qt;return this.uc(()=>this.Xu&&this.rc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Zu.push(e),this.cc()))}async cc(){if(0!==this.Zu.length){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!Qn(e))throw e;Rt(zf,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_(()=>this.cc())}}uc(e){const t=this._c.then(()=>(this.nc=!0,e().catch(e=>{throw this.tc=e,this.nc=!1,Ot("INTERNAL UNHANDLED ERROR: ",Kf(e)),e}).then(e=>(this.nc=!1,e))));return this._c=t,t}enqueueAfterDelay(e,t,n){this.ac(),this.sc.indexOf(e)>-1&&(t=0);const r=Yh.createAndSchedule(this,e,t,n,e=>this.lc(e));return this.ec.push(r),r}ac(){this.tc&&Mt(47125,{hc:Kf(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do{e=this._c,await e}while(e!==this._c)}Tc(e){for(const t of this.ec)if(t.timerId===e)return!0;return!1}Ic(e){return this.Pc().then(()=>{this.ec.sort((e,t)=>e.targetTimeMs-t.targetTimeMs);for(const t of this.ec)if(t.skipDelay(),"all"!==e&&t.timerId===e)break;return this.Pc()})}dc(e){this.sc.push(e)}lc(e){const t=this.ec.indexOf(e);this.ec.splice(t,1)}}function Kf(e){let t=e.message||"";return e.stack&&(t=e.stack.includes(e.message)?e.stack:e.message+"\n"+e.stack),t
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}function Gf(e){return function(e,t){if("object"!=typeof e||null===e)return!1;const n=e;for(const r of t)if(r in n&&"function"==typeof n[r])return!0;return!1}(e,["next","error","complete"])}class Hf{constructor(){this._progressObserver={},this._taskCompletionResolver=new qt,this._lastProgress={taskState:"Running",totalBytes:0,totalDocuments:0,bytesLoaded:0,documentsLoaded:0}}onProgress(e,t,n){this._progressObserver={next:e,error:t,complete:n}}catch(e){return this._taskCompletionResolver.promise.catch(e)}then(e,t){return this._taskCompletionResolver.promise.then(e,t)}_completeWith(e){this._updateProgress(e),this._progressObserver.complete&&this._progressObserver.complete(),this._taskCompletionResolver.resolve(e)}_failWith(e){this._lastProgress.taskState="Error",this._progressObserver.next&&this._progressObserver.next(this._lastProgress),this._progressObserver.error&&this._progressObserver.error(e),this._taskCompletionResolver.reject(e)}_updateProgress(e){this._lastProgress=e,this._progressObserver.next&&this._progressObserver.next(e)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wf extends Lf{constructor(e,t,n,r){super(e,t,n,r),this.type="firestore",this._queue=new $f,this._persistenceKey=(null==r?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new $f(e),this._firestoreClient=void 0,await e}}}function Qf(e,t){const n="object"==typeof e?e:nt(),r="string"==typeof e?e:t||Ki,i=Je(n,"firestore").getImmediate({identifier:r});if(!i._initialized){const e=u("firestore");e&&Mf(i,...e)}return i}function Jf(e){if(e._terminated)throw new Bt(jt.FAILED_PRECONDITION,"The client has already been terminated.");return e._firestoreClient||Xf(e),e._firestoreClient}function Xf(e){var t,n,r;const i=e._freezeSettings(),s=(o=e._databaseId,a=(null===(t=e._app)||void 0===t?void 0:t.options.appId)||"",c=e._persistenceKey,new $i(o,a,c,(u=i).host,u.ssl,u.experimentalForceLongPolling,u.experimentalAutoDetectLongPolling,Df(u.experimentalLongPollingOptions),u.useFetchStreams,u.isUsingEmulator));var o,a,c,u;e._componentsProvider||(null===(n=i.localCache)||void 0===n?void 0:n._offlineComponentProvider)&&(null===(r=i.localCache)||void 0===r?void 0:r._onlineComponentProvider)&&(e._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),e._firestoreClient=new mf(e._authCredentials,e._appCheckCredentials,e._queue,s,e._componentsProvider&&function(e){const t=null==e?void 0:e._online.build();return{_offline:null==e?void 0:e._offline.build(t),_online:t}}(e._componentsProvider))}function Yf(e,t,n){if((e=wn(e,Wf))._firestoreClient||e._terminated)throw new Bt(jt.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");if(e._componentsProvider||e._getSettings().localCache)throw new Bt(jt.FAILED_PRECONDITION,"SDK cache is already specified.");e._componentsProvider={_online:t,_offline:n},Xf(e)}function Zf(e,t){const n=Jf(e=wn(e,Wf)),r=new Hf;return kf(n,e._databaseId,t,r),r}function ep(e,t){return function(e,t){return e.asyncQueue.enqueue(async()=>function(e,t){const n=Ut(e);return n.persistence.runTransaction("Get named query","readonly",e=>n.Ti.getNamedQuery(e,t))}(await If(e),t))}(Jf(e=wn(e,Wf)),t).then(t=>t?new Ff(e,null,t.query):null)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tp{constructor(e="count",t){this._internalFieldPath=t,this.type="AggregateField",this.aggregateType=e}}class np{constructor(e,t,n){this._userDataWriter=t,this._data=n,this.type="AggregateQuerySnapshot",this.query=e}data(){return this._userDataWriter.convertObjectMap(this._data)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rp{constructor(e){this._byteString=e}static fromBase64String(e){try{return new rp(Ri.fromBase64String(e))}catch(t){throw new Bt(jt.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new rp(Ri.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:rp._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(_n(e,rp._jsonSchema))return rp.fromBase64String(e.bytes)}}rp._jsonSchemaVersion="firestore/bytes/1.0",rp._jsonSchema={type:In("string",rp._jsonSchemaVersion),bytes:In("string")};
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ip{constructor(...e){for(let t=0;t<e.length;++t)if(0===e[t].length)throw new Bt(jt.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new hn(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class sp{constructor(e){this._methodName=e}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class op{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new Bt(jt.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new Bt(jt.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return en(this._lat,e._lat)||en(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:op._jsonSchemaVersion}}static fromJSON(e){if(_n(e,op._jsonSchema))return new op(e.latitude,e.longitude)}}op._jsonSchemaVersion="firestore/geoPoint/1.0",op._jsonSchema={type:In("string",op._jsonSchemaVersion),latitude:In("number"),longitude:In("number")};
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ap{constructor(e){this._values=(e||[]).map(e=>e)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;++n)if(e[n]!==t[n])return!1;return!0}(this._values,e._values)}toJSON(){return{type:ap._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(_n(e,ap._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(e=>"number"==typeof e))return new ap(e.vectorValues);throw new Bt(jt.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}ap._jsonSchemaVersion="firestore/vectorValue/1.0",ap._jsonSchema={type:In("string",ap._jsonSchemaVersion),vectorValues:In("object")};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const cp=/^__.*__$/;class up{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return null!==this.fieldMask?new ca(e,this.data,this.fieldMask,t,this.fieldTransforms):new aa(e,this.data,t,this.fieldTransforms)}}class lp{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new ca(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function hp(e){switch(e){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Mt(40011,{Ec:e})}}class dp{constructor(e,t,n,r,i,s){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=r,void 0===i&&this.Ac(),this.fieldTransforms=i||[],this.fieldMask=s||[]}get path(){return this.settings.path}get Ec(){return this.settings.Ec}Rc(e){return new dp(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Vc(e){var t;const n=null===(t=this.path)||void 0===t?void 0:t.child(e),r=this.Rc({path:n,mc:!1});return r.fc(e),r}gc(e){var t;const n=null===(t=this.path)||void 0===t?void 0:t.child(e),r=this.Rc({path:n,mc:!1});return r.Ac(),r}yc(e){return this.Rc({path:void 0,mc:!0})}wc(e){return Rp(e,this.settings.methodName,this.settings.Sc||!1,this.path,this.settings.bc)}contains(e){return void 0!==this.fieldMask.find(t=>e.isPrefixOf(t))||void 0!==this.fieldTransforms.find(t=>e.isPrefixOf(t.field))}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.fc(this.path.get(e))}fc(e){if(0===e.length)throw this.wc("Document fields must not be empty");if(hp(this.Ec)&&cp.test(e))throw this.wc('Document fields cannot begin and end with "__"')}}class fp{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||dh(e)}Dc(e,t,n,r=!1){return new dp({Ec:e,methodName:t,bc:n,path:hn.emptyPath(),mc:!1,Sc:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function pp(e){const t=e._freezeSettings(),n=dh(e._databaseId);return new fp(e._databaseId,!!t.ignoreUndefinedProperties,n)}function mp(e,t,n,r,i,s={}){const o=e.Dc(s.merge||s.mergeFields?2:0,t,n,i);kp("Data must be an object, but it was:",o,r);const a=Cp(r,o);let c,u;if(s.merge)c=new Di(o.fieldMask),u=o.fieldTransforms;else if(s.mergeFields){const e=[];for(const r of s.mergeFields){const i=Np(t,r,n);if(!o.contains(i))throw new Bt(jt.INVALID_ARGUMENT,`Field '${i}' is specified in your field mask but missing from your input data.`);Op(e,i)||e.push(i)}c=new Di(e),u=o.fieldTransforms.filter(e=>c.covers(e.field))}else c=null,u=o.fieldTransforms;return new up(new _s(a),c,u)}class gp extends sp{_toFieldTransform(e){if(2!==e.Ec)throw 1===e.Ec?e.wc(`${this._methodName}() can only appear at the top level of your update data`):e.wc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof gp}}function yp(e,t,n){return new dp({Ec:3,bc:t.settings.bc,methodName:e._methodName,mc:n},t.databaseId,t.serializer,t.ignoreUndefinedProperties)}class vp extends sp{_toFieldTransform(e){return new Xo(e.path,new zo)}isEqual(e){return e instanceof vp}}class wp extends sp{constructor(e,t){super(e),this.vc=t}_toFieldTransform(e){const t=yp(this,e,!0),n=this.vc.map(e=>Sp(e,t)),r=new $o(n);return new Xo(e.path,r)}isEqual(e){return e instanceof wp&&D(this.vc,e.vc)}}class bp extends sp{constructor(e,t){super(e),this.vc=t}_toFieldTransform(e){const t=yp(this,e,!0),n=this.vc.map(e=>Sp(e,t)),r=new Go(n);return new Xo(e.path,r)}isEqual(e){return e instanceof bp&&D(this.vc,e.vc)}}class Ip extends sp{constructor(e,t){super(e),this.Cc=t}_toFieldTransform(e){const t=new Wo(e.serializer,Vo(e.serializer,this.Cc));return new Xo(e.path,t)}isEqual(e){return e instanceof Ip&&this.Cc===e.Cc}}function _p(e,t,n,r){const i=e.Dc(1,t,n);kp("Data must be an object, but it was:",i,r);const s=[],o=_s.empty();Ii(r,(e,r)=>{const a=xp(t,e,n);r=V(r);const c=i.gc(a);if(r instanceof gp)s.push(a);else{const e=Sp(r,c);null!=e&&(s.push(a),o.set(a,e))}});const a=new Di(s);return new lp(o,a,i.fieldTransforms)}function Tp(e,t,n,r,i,s){const o=e.Dc(1,t,n),a=[Np(t,r,n)],c=[i];if(s.length%2!=0)throw new Bt(jt.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let d=0;d<s.length;d+=2)a.push(Np(t,s[d])),c.push(s[d+1]);const u=[],l=_s.empty();for(let d=a.length-1;d>=0;--d)if(!Op(u,a[d])){const e=a[d];let t=c[d];t=V(t);const n=o.gc(e);if(t instanceof gp)u.push(e);else{const r=Sp(t,n);null!=r&&(u.push(e),l.set(e,r))}}const h=new Di(u);return new lp(l,h,o.fieldTransforms)}function Ep(e,t,n,r=!1){return Sp(n,e.Dc(r?4:3,t))}function Sp(e,t){if(Ap(e=V(e)))return kp("Unsupported field value:",t,e),Cp(e,t);if(e instanceof sp)return function(e,t){if(!hp(t.Ec))throw t.wc(`${e._methodName}() can only be used with update() and set()`);if(!t.path)throw t.wc(`${e._methodName}() is not currently supported inside arrays`);const n=e._toFieldTransform(t);n&&t.fieldTransforms.push(n)}(e,t),null;if(void 0===e&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),e instanceof Array){if(t.settings.mc&&4!==t.Ec)throw t.wc("Nested arrays are not supported");return function(e,t){const n=[];let r=0;for(const i of e){let e=Sp(i,t.yc(r));null==e&&(e={nullValue:"NULL_VALUE"}),n.push(e),r++}return{arrayValue:{values:n}}}(e,t)}return function(e,t){if(null===(e=V(e)))return{nullValue:"NULL_VALUE"};if("number"==typeof e)return Vo(t.serializer,e);if("boolean"==typeof e)return{booleanValue:e};if("string"==typeof e)return{stringValue:e};if(e instanceof Date){const n=Sn.fromDate(e);return{timestampValue:za(t.serializer,n)}}if(e instanceof Sn){const n=new Sn(e.seconds,1e3*Math.floor(e.nanoseconds/1e3));return{timestampValue:za(t.serializer,n)}}if(e instanceof op)return{geoPointValue:{latitude:e.latitude,longitude:e.longitude}};if(e instanceof rp)return{bytesValue:$a(t.serializer,e._byteString)};if(e instanceof Vf){const n=t.databaseId,r=e.firestore._databaseId;if(!r.isEqual(n))throw t.wc(`Document reference is for database ${r.projectId}/${r.database} but should be for database ${n.projectId}/${n.database}`);return{referenceValue:Ha(e.firestore._databaseId||t.databaseId,e._key.path)}}if(e instanceof ap)return n=e,r=t,{mapValue:{fields:{[Hi]:{stringValue:Ji},[Xi]:{arrayValue:{values:n.toArray().map(e=>{if("number"!=typeof e)throw r.wc("VectorValues must only contain numeric values.");return Mo(r.serializer,e)})}}}}};var n,r;throw t.wc(`Unsupported field value: ${vn(e)}`)}(e,t)}function Cp(e,t){const n={};return Ti(e)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):Ii(e,(e,r)=>{const i=Sp(r,t.Vc(e));null!=i&&(n[e]=i)}),{mapValue:{fields:n}}}function Ap(e){return!("object"!=typeof e||null===e||e instanceof Array||e instanceof Date||e instanceof Sn||e instanceof op||e instanceof rp||e instanceof Vf||e instanceof sp||e instanceof ap)}function kp(e,t,n){if(!Ap(n)||!yn(n)){const r=vn(n);throw"an object"===r?t.wc(e+" a custom object"):t.wc(e+" "+r)}}function Np(e,t,n){if((t=V(t))instanceof ip)return t._internalPath;if("string"==typeof t)return xp(e,t);throw Rp("Field path arguments must be of type string or ",e,!1,void 0,n)}const Dp=new RegExp("[~\\*/\\[\\]]");function xp(e,t,n){if(t.search(Dp)>=0)throw Rp(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,e,!1,void 0,n);try{return new ip(...t.split("."))._internalPath}catch(r){throw Rp(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,e,!1,void 0,n)}}function Rp(e,t,n,r,i){const s=r&&!r.isEmpty(),o=void 0!==i;let a=`Function ${t}() called with invalid data`;n&&(a+=" (via `toFirestore()`)"),a+=". ";let c="";return(s||o)&&(c+=" (found",s&&(c+=` in field ${r}`),o&&(c+=` in document ${i}`),c+=")"),new Bt(jt.INVALID_ARGUMENT,a+e+c)}function Op(e,t){return e.some(e=>e.isEqual(t))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pp{constructor(e,t,n,r,i){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=r,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new Vf(this._firestore,this._converter,this._key)}exists(){return null!==this._document}data(){if(this._document){if(this._converter){const e=new Lp(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(Mp("DocumentSnapshot.get",e));if(null!==t)return this._userDataWriter.convertValue(t)}}}class Lp extends Pp{data(){return super.data()}}function Mp(e,t){return"string"==typeof t?xp(e,t):t instanceof ip?t._internalPath:t._delegate._internalPath}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fp(e){if("L"===e.limitType&&0===e.explicitOrderBy.length)throw new Bt(jt.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Vp{}class Up extends Vp{}function jp(e,t,...n){let r=[];t instanceof Vp&&r.push(t),r=r.concat(n),function(e){const t=e.filter(e=>e instanceof qp).length,n=e.filter(e=>e instanceof Bp).length;if(t>1||t>0&&n>0)throw new Bt(jt.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const i of r)e=i._apply(e);return e}class Bp extends Up{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new Bp(e,t,n)}_apply(e){const t=this._parse(e);return Yp(e._query,t),new Ff(e.firestore,e.converter,fo(e._query,t))}_parse(e){const t=pp(e.firestore);return function(e,t,n,r,i,s,o){let a;if(i.isKeyField()){if("array-contains"===s||"array-contains-any"===s)throw new Bt(jt.INVALID_ARGUMENT,`Invalid Query. You can't perform '${s}' queries on documentId().`);if("in"===s||"not-in"===s){Xp(o,s);const t=[];for(const n of o)t.push(Jp(r,e,n));a={arrayValue:{values:t}}}else a=Jp(r,e,o)}else"in"!==s&&"not-in"!==s&&"array-contains-any"!==s||Xp(o,s),a=Ep(n,t,o,"in"===s||"not-in"===s);return xs.create(i,s,a)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}class qp extends Vp{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new qp(e,t)}_parse(e){const t=this._queryConstraints.map(t=>t._parse(e)).filter(e=>e.getFilters().length>0);return 1===t.length?t[0]:Rs.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return 0===t.getFilters().length?e:(function(e,t){let n=e;const r=t.getFlattenedFilters();for(const i of r)Yp(n,i),n=fo(n,i)}(e._query,t),new Ff(e.firestore,e.converter,fo(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return"and"===this.type?"and":"or"}}class zp extends Up{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new zp(e,t)}_apply(e){const t=function(e,t,n){if(null!==e.startAt)throw new Bt(jt.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(null!==e.endAt)throw new Bt(jt.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new ks(t,n)}(e._query,this._field,this._direction);return new Ff(e.firestore,e.converter,function(e,t){const n=e.explicitOrderBy.concat([t]);return new ro(e.path,e.collectionGroup,n,e.filters.slice(),e.limit,e.limitType,e.startAt,e.endAt)}(e._query,t))}}function $p(e,t="asc"){const n=t,r=Mp("orderBy",e);return zp._create(r,n)}class Kp extends Up{constructor(e,t,n){super(),this.type=e,this._limit=t,this._limitType=n}static _create(e,t,n){return new Kp(e,t,n)}_apply(e){return new Ff(e.firestore,e.converter,po(e._query,this._limit,this._limitType))}}function Gp(e){return bn("limit",e),Kp._create("limit",e,"F")}class Hp extends Up{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new Hp(e,t,n)}_apply(e){const t=Qp(e,this.type,this._docOrFields,this._inclusive);return new Ff(e.firestore,e.converter,(n=e._query,r=t,new ro(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),n.limit,n.limitType,r,n.endAt)));var n,r}}class Wp extends Up{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new Wp(e,t,n)}_apply(e){const t=Qp(e,this.type,this._docOrFields,this._inclusive);return new Ff(e.firestore,e.converter,(n=e._query,r=t,new ro(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),n.limit,n.limitType,n.startAt,r)));var n,r}}function Qp(e,t,n,r){if(n[0]=V(n[0]),n[0]instanceof Pp)return function(e,t,n,r,i){if(!r)throw new Bt(jt.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${n}().`);const s=[];for(const o of co(e))if(o.field.isKeyField())s.push(cs(t,r.key));else{const e=r.data.field(o.field);if(Bi(e))throw new Bt(jt.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+o.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(null===e){const e=o.field.canonicalString();throw new Bt(jt.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${e}' (used as the orderBy) does not exist.`)}s.push(e)}return new Ss(s,i)}(e._query,e.firestore._databaseId,t,n[0]._document,r);{const i=pp(e.firestore);return function(e,t,n,r,i,s){const o=e.explicitOrderBy;if(i.length>o.length)throw new Bt(jt.INVALID_ARGUMENT,`Too many arguments provided to ${r}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const a=[];for(let c=0;c<i.length;c++){const s=i[c];if(o[c].field.isKeyField()){if("string"!=typeof s)throw new Bt(jt.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${r}(), but got a ${typeof s}`);if(!ao(e)&&-1!==s.indexOf("/"))throw new Bt(jt.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${r}() must be a plain document ID, but '${s}' contains a slash.`);const n=e.path.child(un.fromString(s));if(!dn.isDocumentKey(n))throw new Bt(jt.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${r}() must result in a valid document path, but '${n}' is not because it contains an odd number of segments.`);const i=new dn(n);a.push(cs(t,i))}else{const e=Ep(n,r,s);a.push(e)}}return new Ss(a,s)}(e._query,e.firestore._databaseId,i,t,n,r)}}function Jp(e,t,n){if("string"==typeof(n=V(n))){if(""===n)throw new Bt(jt.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!ao(t)&&-1!==n.indexOf("/"))throw new Bt(jt.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const r=t.path.child(un.fromString(n));if(!dn.isDocumentKey(r))throw new Bt(jt.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return cs(e,new dn(r))}if(n instanceof Vf)return cs(e,n._key);throw new Bt(jt.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${vn(n)}.`)}function Xp(e,t){if(!Array.isArray(e)||0===e.length)throw new Bt(jt.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function Yp(e,t){const n=function(e,t){for(const n of e)for(const e of n.getFlattenedFilters())if(t.indexOf(e.op)>=0)return e.op;return null}(e.filters,function(e){switch(e){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(null!==n)throw n===t.op?new Bt(jt.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new Bt(jt.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${n.toString()}' filters.`)}function Zp(e,t){if(!(t instanceof Bp||t instanceof qp))throw new Bt(jt.INVALID_ARGUMENT,`Function ${e}() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'.`)}class em{convertValue(e,t="none"){switch(Zi(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Li(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Mi(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw Mt(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return Ii(e,(e,r)=>{n[e]=this.convertValue(r,t)}),n}convertVectorValue(e){var t,n,r;const i=null===(r=null===(n=null===(t=e.fields)||void 0===t?void 0:t[Xi].arrayValue)||void 0===n?void 0:n.values)||void 0===r?void 0:r.map(e=>Li(e.doubleValue));return new ap(i)}convertGeoPoint(e){return new op(Li(e.latitude),Li(e.longitude))}convertArray(e,t){return(e.values||[]).map(e=>this.convertValue(e,t))}convertServerTimestamp(e,t){switch(t){case"previous":const n=qi(e);return null==n?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(zi(e));default:return null}}convertTimestamp(e){const t=Pi(e);return new Sn(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=un.fromString(e);Vt(vc(n),9688,{name:e});const r=new Gi(n.get(1),n.get(3)),i=new dn(n.popFirst(5));return r.isEqual(t)||Ot(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tm(e,t,n){let r;return r=e?n&&(n.merge||n.mergeFields)?e.toFirestore(t,n):e.toFirestore(t):t,r}class nm extends em{constructor(e){super(),this.firestore=e}convertBytes(e){return new rp(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Vf(this.firestore,null,t)}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rm(){return new tp("count")}
/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const im="NOT SUPPORTED";class sm{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class om extends Pp{constructor(e,t,n,r,i,s){super(e,t,n,r,s),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new am(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(Mp("DocumentSnapshot.get",e));if(null!==n)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new Bt(jt.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=om._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),e&&e.isValidDocument()&&e.isFoundDocument()?(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t):t}}om._jsonSchemaVersion="firestore/documentSnapshot/1.0",om._jsonSchema={type:In("string",om._jsonSchemaVersion),bundleSource:In("string","DocumentSnapshot"),bundleName:In("string"),bundle:In("string")};class am extends om{data(e={}){return super.data(e)}}class cm{constructor(e,t,n,r){this._firestore=e,this._userDataWriter=t,this._snapshot=r,this.metadata=new sm(r.hasPendingWrites,r.fromCache),this.query=n}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return 0===this.size}forEach(e,t){this._snapshot.docs.forEach(n=>{e.call(t,new am(this._firestore,this._userDataWriter,n.key,n,new sm(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new Bt(jt.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(e,t){if(e._snapshot.oldDocs.isEmpty()){let t=0;return e._snapshot.docChanges.map(n=>{const r=new am(e._firestore,e._userDataWriter,n.doc.key,n.doc,new sm(e._snapshot.mutatedKeys.has(n.doc.key),e._snapshot.fromCache),e.query.converter);return n.doc,{type:"added",doc:r,oldIndex:-1,newIndex:t++}})}{let n=e._snapshot.oldDocs;return e._snapshot.docChanges.filter(e=>t||3!==e.type).map(t=>{const r=new am(e._firestore,e._userDataWriter,t.doc.key,t.doc,new sm(e._snapshot.mutatedKeys.has(t.doc.key),e._snapshot.fromCache),e.query.converter);let i=-1,s=-1;return 0!==t.type&&(i=n.indexOf(t.doc.key),n=n.delete(t.doc.key)),1!==t.type&&(n=n.add(t.doc),s=n.indexOf(t.doc.key)),{type:um(t.type),doc:r,oldIndex:i,newIndex:s}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new Bt(jt.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=cm._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Zt.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],n=[],r=[];return this.docs.forEach(e=>{null!==e._document&&(t.push(e._document),n.push(this._userDataWriter.convertObjectMap(e._document.data.value.mapValue.fields,"previous")),r.push(e.ref.path))}),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function um(e){switch(e){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Mt(61501,{type:e})}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function lm(e){e=wn(e,Vf);const t=wn(e.firestore,Wf);return Cf(Jf(t),e._key).then(n=>ym(t,e,n))}cm._jsonSchemaVersion="firestore/querySnapshot/1.0",cm._jsonSchema={type:In("string",cm._jsonSchemaVersion),bundleSource:In("string","QuerySnapshot"),bundleName:In("string"),bundle:In("string")};class hm extends em{constructor(e){super(),this.firestore=e}convertBytes(e){return new rp(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Vf(this.firestore,null,t)}}function dm(e){e=wn(e,Ff);const t=wn(e.firestore,Wf),n=Jf(t),r=new hm(t);return Fp(e._query),Af(n,e._query).then(n=>new cm(t,r,e,n))}function fm(e,t,n){e=wn(e,Vf);const r=wn(e.firestore,Wf),i=tm(e.converter,t,n);return gm(r,[mp(pp(r),"setDoc",e._key,i,null!==e.converter,n).toMutation(e._key,Zo.none())])}function pm(e){return gm(wn(e.firestore,Wf),[new da(e._key,Zo.none())])}function mm(e,...t){var n,r,i;e=V(e);let s={includeMetadataChanges:!1,source:"default"},o=0;"object"!=typeof t[o]||Gf(t[o])||(s=t[o++]);const a={includeMetadataChanges:s.includeMetadataChanges,source:s.source};if(Gf(t[o])){const e=t[o];t[o]=null===(n=e.next)||void 0===n?void 0:n.bind(e),t[o+1]=null===(r=e.error)||void 0===r?void 0:r.bind(e),t[o+2]=null===(i=e.complete)||void 0===i?void 0:i.bind(e)}let c,u,l;if(e instanceof Vf)u=wn(e.firestore,Wf),l=so(e._key.path),c={next:n=>{t[o]&&t[o](ym(u,e,n))},error:t[o+1],complete:t[o+2]};else{const n=wn(e,Ff);u=wn(n.firestore,Wf),l=n._query;const r=new hm(u);c={next:e=>{t[o]&&t[o](new cm(u,r,n,e))},error:t[o+1],complete:t[o+2]},Fp(e._query)}return function(e,t,n,r){const i=new uf(r),s=new fd(t,i,n);return e.asyncQueue.enqueueAndForget(async()=>od(await Sf(e),s)),()=>{i.Ou(),e.asyncQueue.enqueueAndForget(async()=>ad(await Sf(e),s))}}(Jf(u),l,a,c)}function gm(e,t){return function(e,t){const n=new qt;return e.asyncQueue.enqueueAndForget(async()=>async function(t,n,r){const i=tf(t);try{const e=await function(e,t){const n=Ut(e),r=Sn.now(),i=t.reduce((e,t)=>e.add(t.key),Oo());let s,o;return n.persistence.runTransaction("Locally write mutations","readwrite",e=>{let a=Eo(),c=Oo();return n.Os.getEntries(e,i).next(e=>{a=e,a.forEach((e,t)=>{t.isValidDocument()||(c=c.add(e))})}).next(()=>n.localDocuments.getOverlayedDocuments(e,a)).next(i=>{s=i;const o=[];for(const e of t){const t=sa(e,s.get(e.key).overlayedDocument);null!=t&&o.push(new ca(e.key,t,Ts(t.value.mapValue),Zo.exists(!0)))}return n.mutationQueue.addMutationBatch(e,r,o,t)}).next(t=>{o=t;const r=t.applyToLocalDocumentSet(s,c);return n.documentOverlayCache.saveOverlays(e,t.batchId,r)})}).then(()=>({batchId:o.batchId,changes:Ao(s)}))}(i.localStore,n);i.sharedClientState.addPendingMutation(e.batchId),function(e,t,n){let r=e.Ru[e.currentUser.toKey()];r||(r=new Ei(en)),r=r.insert(t,n),e.Ru[e.currentUser.toKey()]=r}(i,e.batchId,r),await zd(i,e.changes),await Uh(i.remoteStore)}catch(e){const n=Zh(e,"Failed to persist write");r.reject(n)}}(await Tf(e),t,n)),n.promise}(Jf(e),t)}function ym(e,t,n){const r=n.docs.get(t._key),i=new hm(e);return new om(e,i,t._key,r,new sm(n.hasPendingWrites,n.fromCache),t.converter)}function vm(e,t){const n=wn(e.firestore,Wf),r=Jf(n),i=_i(t,(e,t)=>new ya(t,e.aggregateType,e._internalFieldPath));return function(e,t,n){const r=new qt;return e.asyncQueue.enqueueAndForget(async()=>{try{const i=await Ef(e);r.resolve(async function(e,t,n){var r;const i=Ut(e),{request:s,ft:o,parent:a}=cc(i.serializer,lo(t),n);i.connection.Qo||delete s.parent;const c=(await i.Jo("RunAggregationQuery",i.serializer.databaseId,a,s,1)).filter(e=>!!e.result);Vt(1===c.length,64727);const u=null===(r=c[0].result)||void 0===r?void 0:r.aggregateFields;return Object.keys(u).reduce((e,t)=>(e[o[t]]=u[t],e),{})}(i,t,n))}catch(i){r.reject(i)}}),r.promise}(r,e._query,i).then(t=>function(e,t,n){const r=new hm(e);return new np(t,r,n)}(n,e,t))}class wm{constructor(e){this.kind="memory",this._onlineComponentProvider=af.provider,(null==e?void 0:e.garbageCollector)?this._offlineComponentProvider=e.garbageCollector._offlineComponentProvider:this._offlineComponentProvider={build:()=>new rf(void 0)}}toJSON(){return{kind:this.kind}}}class bm{constructor(e){let t;this.kind="persistent",(null==e?void 0:e.tabManager)?(e.tabManager._initialize(e),t=e.tabManager):(t=Sm(void 0),t._initialize(e)),this._onlineComponentProvider=t._onlineComponentProvider,this._offlineComponentProvider=t._offlineComponentProvider}toJSON(){return{kind:this.kind}}}class Im{constructor(){this.kind="memoryEager",this._offlineComponentProvider=nf.provider}toJSON(){return{kind:this.kind}}}class _m{constructor(e){this.kind="memoryLru",this._offlineComponentProvider={build:()=>new rf(e)}}toJSON(){return{kind:this.kind}}}class Tm{constructor(e){this.forceOwnership=e,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=af.provider,this._offlineComponentProvider={build:t=>new sf(t,null==e?void 0:e.cacheSizeBytes,this.forceOwnership)}}}class Em{constructor(){this.kind="PersistentMultipleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=af.provider,this._offlineComponentProvider={build:t=>new of(t,null==e?void 0:e.cacheSizeBytes)}}}function Sm(e){return new Tm(null==e?void 0:e.forceOwnership)}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Cm={maxAttempts:5};
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Am{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=pp(e)}set(e,t,n){this._verifyNotCommitted();const r=km(e,this._firestore),i=tm(r.converter,t,n),s=mp(this._dataReader,"WriteBatch.set",r._key,i,null!==r.converter,n);return this._mutations.push(s.toMutation(r._key,Zo.none())),this}update(e,t,n,...r){this._verifyNotCommitted();const i=km(e,this._firestore);let s;return s="string"==typeof(t=V(t))||t instanceof ip?Tp(this._dataReader,"WriteBatch.update",i._key,t,n,r):_p(this._dataReader,"WriteBatch.update",i._key,t),this._mutations.push(s.toMutation(i._key,Zo.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=km(e,this._firestore);return this._mutations=this._mutations.concat(new da(t._key,Zo.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new Bt(jt.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function km(e,t){if((e=V(e)).firestore!==t)throw new Bt(jt.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return e}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nm{constructor(e,t){this._firestore=e,this._transaction=t,this._dataReader=pp(e)}get(e){const t=km(e,this._firestore),n=new nm(this._firestore);return this._transaction.lookup([t._key]).then(e=>{if(!e||1!==e.length)return Mt(24041);const r=e[0];if(r.isFoundDocument())return new Pp(this._firestore,n,r.key,r,t.converter);if(r.isNoDocument())return new Pp(this._firestore,n,t._key,null,t.converter);throw Mt(18433,{doc:r})})}set(e,t,n){const r=km(e,this._firestore),i=tm(r.converter,t,n),s=mp(this._dataReader,"Transaction.set",r._key,i,null!==r.converter,n);return this._transaction.set(r._key,s),this}update(e,t,n,...r){const i=km(e,this._firestore);let s;return s="string"==typeof(t=V(t))||t instanceof ip?Tp(this._dataReader,"Transaction.update",i._key,t,n,r):_p(this._dataReader,"Transaction.update",i._key,t),this._transaction.update(i._key,s),this}delete(e){const t=km(e,this._firestore);return this._transaction.delete(t._key),this}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dm extends Nm{constructor(e,t){super(e,t),this._firestore=e}get(e){const t=km(e,this._firestore),n=new hm(this._firestore);return super.get(e).then(e=>new om(this._firestore,n,t._key,e._document,new sm(!1,!1),t.converter))}}function xm(e,t){if("string"!=typeof e[t])throw new Bt(jt.INVALID_ARGUMENT,"Missing string value for: "+t);return e[t]}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rm{constructor(e){this._firestore=e,this.type="PersistentCacheIndexManager"}}function Om(e,t){(function(e,t){return e.asyncQueue.enqueue(async()=>{return n=await If(e),r=t,void(Ut(n).Cs.Rs=r);var n,r})})(Jf(e._firestore),t).then(e=>Rt(`setting persistent cache index auto creation isEnabled=${t} succeeded`)).catch(e=>Pt(`setting persistent cache index auto creation isEnabled=${t} failed`,e))}const Pm=new WeakMap;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lm{constructor(){this.Fc=new Map}static get instance(){return Mm||(Mm=new Lm,function(e){if(Ta)throw new Error("a TestingHooksSpi instance is already set");Ta=e}(Mm)),Mm}ct(e){this.Fc.forEach(t=>t(e))}onExistenceFilterMismatch(e){const t=Symbol(),n=this.Fc;return n.set(t,e),()=>n.delete(t)}}let Mm=null;!function(e,t=!0){Nt=et,Qe(new U("firestore",(e,{instanceIdentifier:n,options:r})=>{const i=e.getProvider("app").getImmediate(),s=new Wf(new Gt(e.getProvider("auth-internal")),new Jt(i,e.getProvider("app-check-internal")),function(e,t){if(!Object.prototype.hasOwnProperty.apply(e.options,["projectId"]))throw new Bt(jt.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Gi(e.options.projectId,t)}(i,n),i);return r=Object.assign({useFetchStreams:t},r),s._setSettings(r),s},"PUBLIC").setMultipleInstances(!0)),rt(Ct,At,e),rt(Ct,At,"esm2017")}();const Fm=Object.freeze(Object.defineProperty({__proto__:null,AbstractUserDataWriter:em,AggregateField:tp,AggregateQuerySnapshot:np,Bytes:rp,CACHE_SIZE_UNLIMITED:-1,CollectionReference:Uf,DocumentReference:Vf,DocumentSnapshot:om,FieldPath:ip,FieldValue:sp,Firestore:Wf,FirestoreError:Bt,GeoPoint:op,LoadBundleTask:Hf,PersistentCacheIndexManager:Rm,Query:Ff,QueryCompositeFilterConstraint:qp,QueryConstraint:Up,QueryDocumentSnapshot:am,QueryEndAtConstraint:Wp,QueryFieldFilterConstraint:Bp,QueryLimitConstraint:Kp,QueryOrderByConstraint:zp,QuerySnapshot:cm,QueryStartAtConstraint:Hp,SnapshotMetadata:sm,Timestamp:Sn,Transaction:Dm,VectorValue:ap,WriteBatch:Am,_AutoId:Zt,_ByteString:Ri,_DatabaseId:Gi,_DocumentKey:dn,_EmptyAppCheckTokenProvider:class{getToken(){return Promise.resolve(new Qt(""))}invalidateToken(){}start(e,t){}shutdown(){}},_EmptyAuthCredentialsProvider:$t,_FieldPath:hn,_TestingHooks:
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class{constructor(){throw new Error("instances of this class should not be created")}static onExistenceFilterMismatch(e){return Lm.instance.onExistenceFilterMismatch(e)}},_cast:wn,_debugAssert:function(e,t){e||Mt(57014,t)},_internalAggregationQueryToProtoRunAggregationQueryRequest:function(e,t){var n;const r=_i(t,(e,t)=>new ya(t,e.aggregateType,e._internalFieldPath)),i=null===(n=Jf(wn(e.firestore,Wf))._onlineComponents)||void 0===n?void 0:n.datastore.serializer;return void 0===i?null:cc(i,lo(e._query),r,!0).request},_internalQueryToProtoQueryTarget:function(e){var t;const n=null===(t=Jf(wn(e.firestore,Wf))._onlineComponents)||void 0===t?void 0:t.datastore.serializer;return void 0===n?null:ac(n,uo(e._query)).Vt},_isBase64Available:function(){return"undefined"!=typeof atob},_logWarn:Pt,_validateIsNotUsedTogether:pn,addDoc:function(e,t){const n=wn(e.firestore,Wf),r=Bf(e),i=tm(e.converter,t);return gm(n,[mp(pp(e.firestore),"addDoc",r._key,i,null!==e.converter,{}).toMutation(r._key,Zo.exists(!1))]).then(()=>r)},aggregateFieldEqual:function(e,t){var n,r;return e instanceof tp&&t instanceof tp&&e.aggregateType===t.aggregateType&&(null===(n=e._internalFieldPath)||void 0===n?void 0:n.canonicalString())===(null===(r=t._internalFieldPath)||void 0===r?void 0:r.canonicalString())},aggregateQuerySnapshotEqual:function(e,t){return qf(e.query,t.query)&&D(e.data(),t.data())},and:function(...e){return e.forEach(e=>Zp("and",e)),qp._create("and",e)},arrayRemove:function(...e){return new bp("arrayRemove",e)},arrayUnion:function(...e){return new wp("arrayUnion",e)},average:function(e){return new tp("avg",Np("average",e))},clearIndexedDbPersistence:function(e){if(e._initialized&&!e._terminated)throw new Bt(jt.FAILED_PRECONDITION,"Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");const t=new qt;return e._queue.enqueueAndForgetEvenWhileRestricted(async()=>{try{await async function(e){if(!Kn.C())return Promise.resolve();const t=e+yl;await Kn.delete(t)}(Il(e._databaseId,e._persistenceKey)),t.resolve()}catch(n){t.reject(n)}}),t.promise},collection:jf,collectionGroup:function(e,t){if(e=wn(e,Lf),fn("collectionGroup","collection id",t),t.indexOf("/")>=0)throw new Bt(jt.INVALID_ARGUMENT,`Invalid collection ID '${t}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);return new Ff(e,null,(n=t,new ro(un.emptyPath(),n)));var n},connectFirestoreEmulator:Mf,count:rm,deleteAllPersistentCacheIndexes:function(e){(function(e){return e.asyncQueue.enqueue(async()=>function(e){const t=Ut(e),n=t.indexManager;return t.persistence.runTransaction("Delete All Indexes","readwrite",e=>n.deleteAllFieldIndexes(e))}(await If(e)))})(Jf(e._firestore)).then(e=>Rt("deleting all persistent cache indexes succeeded")).catch(e=>Pt("deleting all persistent cache indexes failed",e))},deleteDoc:pm,deleteField:
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){return new gp("deleteField")},disableNetwork:function(e){return function(e){return e.asyncQueue.enqueue(async()=>{const t=await bf(e),n=await _f(e);return t.setNetworkEnabled(!1),async function(e){const t=Ut(e);t.Ia.add(0),await Eh(t),t.Aa.set("Offline")}(n)})}(Jf(e=wn(e,Wf)))},disablePersistentCacheIndexAutoCreation:function(e){Om(e,!1)},doc:Bf,documentId:function(){return new ip(an)},documentSnapshotFromJSON:function(e,t,n){if(_n(t,om._jsonSchema)){if(t.bundle===im)throw new Bt(jt.INVALID_ARGUMENT,"The provided JSON object was created in a client environment, which is not supported.");const r=dh(e._databaseId),i=Nf(t.bundle,r),s=i.Ku(),o=new gd(i.getMetadata(),r);for(const e of s)o.Wa(e);const a=o.documents;if(1!==a.length)throw new Bt(jt.INVALID_ARGUMENT,`Expected bundle data to contain 1 document, but it contains ${a.length} documents.`);const c=rc(r,a[0].document),u=new dn(un.fromString(t.bundleName));return new om(e,new nm(e),u,c,new sm(!1,!1),n||null)}},enableIndexedDbPersistence:function(e,t){Pt("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const n=e._freezeSettings();return Yf(e,af.provider,{build:e=>new sf(e,n.cacheSizeBytes,null==t?void 0:t.forceOwnership)}),Promise.resolve()},enableMultiTabIndexedDbPersistence:async function(e){Pt("enableMultiTabIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const t=e._freezeSettings();Yf(e,af.provider,{build:e=>new of(e,t.cacheSizeBytes)})},enableNetwork:function(e){return function(e){return e.asyncQueue.enqueue(async()=>{const t=await bf(e),n=await _f(e);return t.setNetworkEnabled(!0),function(e){const t=Ut(e);return t.Ia.delete(0),Th(t)}(n)})}(Jf(e=wn(e,Wf)))},enablePersistentCacheIndexAutoCreation:function(e){Om(e,!0)},endAt:function(...e){return Wp._create("endAt",e,!0)},endBefore:function(...e){return Wp._create("endBefore",e,!1)},ensureFirestoreConfigured:Jf,executeWrite:gm,getAggregateFromServer:vm,getCountFromServer:function(e){return vm(e,{count:rm()})},getDoc:lm,getDocFromCache:function(e){e=wn(e,Vf);const t=wn(e.firestore,Wf),n=Jf(t),r=new hm(t);return function(e,t){const n=new qt;return e.asyncQueue.enqueueAndForget(async()=>async function(e,t,n){try{const r=await function(e,t){const n=Ut(e);return n.persistence.runTransaction("read document","readonly",e=>n.localDocuments.getDocument(e,t))}(e,t);r.isFoundDocument()?n.resolve(r):r.isNoDocument()?n.resolve(null):n.reject(new Bt(jt.UNAVAILABLE,"Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"))}catch(r){const e=Zh(r,`Failed to get document '${t} from cache`);n.reject(e)}}(await If(e),t,n)),n.promise}(n,e._key).then(n=>new om(t,r,e._key,n,new sm(null!==n&&n.hasLocalMutations,!0),e.converter))},getDocFromServer:function(e){e=wn(e,Vf);const t=wn(e.firestore,Wf);return Cf(Jf(t),e._key,{source:"server"}).then(n=>ym(t,e,n))},getDocs:dm,getDocsFromCache:function(e){e=wn(e,Ff);const t=wn(e.firestore,Wf),n=Jf(t),r=new hm(t);return function(e,t){const n=new qt;return e.asyncQueue.enqueueAndForget(async()=>async function(e,t,n){try{const r=await Pl(e,t,!0),i=new bd(t,r.qs),s=i.nu(r.documents),o=i.applyChanges(s,!1);n.resolve(o.snapshot)}catch(r){const e=Zh(r,`Failed to execute query '${t} against cache`);n.reject(e)}}(await If(e),t,n)),n.promise}(n,e._query).then(n=>new cm(t,r,e,n))},getDocsFromServer:function(e){e=wn(e,Ff);const t=wn(e.firestore,Wf),n=Jf(t),r=new hm(t);return Af(n,e._query,{source:"server"}).then(n=>new cm(t,r,e,n))},getFirestore:Qf,getPersistentCacheIndexManager:function(e){var t;e=wn(e,Wf);const n=Pm.get(e);if(n)return n;if("persistent"!==(null===(t=Jf(e)._uninitializedComponentsProvider)||void 0===t?void 0:t._offline.kind))return null;const r=new Rm(e);return Pm.set(e,r),r},increment:function(e){return new Ip("increment",e)},initializeFirestore:function(e,t,n){n||(n=Ki);const r=Je(e,"firestore");if(r.isInitialized(n)){const e=r.getImmediate({identifier:n});if(D(r.getOptions(n),t))return e;throw new Bt(jt.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(void 0!==t.cacheSizeBytes&&void 0!==t.localCache)throw new Bt(jt.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(void 0!==t.cacheSizeBytes&&-1!==t.cacheSizeBytes&&t.cacheSizeBytes<Ou)throw new Bt(jt.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return t.host&&f(t.host)&&p(t.host),r.initialize({options:t,instanceIdentifier:n})},limit:Gp,limitToLast:function(e){return bn("limitToLast",e),Kp._create("limitToLast",e,"L")},loadBundle:Zf,memoryEagerGarbageCollector:function(){return new Im},memoryLocalCache:function(e){return new wm(e)},memoryLruGarbageCollector:function(e){return new _m(null==e?void 0:e.cacheSizeBytes)},namedQuery:ep,onSnapshot:mm,onSnapshotResume:function(e,t,...n){const r=V(e),i=function(e){const t={bundle:"",bundleName:"",bundleSource:""},n=["bundle","bundleName","bundleSource"];for(const r of n){if(!(r in e)){t.error=`snapshotJson missing required field: ${r}`;break}const n=e[r];if("string"!=typeof n){t.error=`snapshotJson field '${r}' must be a string.`;break}if(0===n.length){t.error=`snapshotJson field '${r}' cannot be an empty string.`;break}"bundle"===r?t.bundle=n:"bundleName"===r?t.bundleName=n:"bundleSource"===r&&(t.bundleSource=n)}return t}(t);if(i.error)throw new Bt(jt.INVALID_ARGUMENT,i.error);let s,o=0;if("object"!=typeof n[o]||Gf(n[o])||(s=n[o++]),"QuerySnapshot"===i.bundleSource){let e=null;if("object"==typeof n[o]&&Gf(n[o])){const t=n[o++];e={next:t.next,error:t.error,complete:t.complete}}else e={next:n[o++],error:n[o++],complete:n[o++]};return function(e,t,n,r,i){let s,o=!1;return Zf(e,t.bundle).then(()=>ep(e,t.bundleName)).then(e=>{e&&!o&&(i&&e.withConverter(i),s=mm(e,n||{},r))}).catch(e=>(r.error&&r.error(e),()=>{})),()=>{o||(o=!0,s&&s())}}(r,i,s,e,n[o])}if("DocumentSnapshot"===i.bundleSource){let e=null;if("object"==typeof n[o]&&Gf(n[o])){const t=n[o++];e={next:t.next,error:t.error,complete:t.complete}}else e={next:n[o++],error:n[o++],complete:n[o++]};return function(e,t,n,r,i){let s,o=!1;return Zf(e,t.bundle).then(()=>{if(!o){const o=new Vf(e,i||null,dn.fromPath(t.bundleName));s=mm(o,n||{},r)}}).catch(e=>(r.error&&r.error(e),()=>{})),()=>{o||(o=!0,s&&s())}}(r,i,s,e,n[o])}throw new Bt(jt.INVALID_ARGUMENT,`unsupported bundle source: ${i.bundleSource}`)},onSnapshotsInSync:function(e,t){return function(e,t){const n=new uf(t);return e.asyncQueue.enqueueAndForget(async()=>{return t=await Sf(e),r=n,Ut(t).Da.add(r),void r.next();var t,r}),()=>{n.Ou(),e.asyncQueue.enqueueAndForget(async()=>{return t=await Sf(e),r=n,void Ut(t).Da.delete(r);var t,r})}}(Jf(e=wn(e,Wf)),Gf(t)?t:{next:t})},or:function(...e){return e.forEach(e=>Zp("or",e)),qp._create("or",e)},orderBy:$p,persistentLocalCache:function(e){return new bm(e)},persistentMultipleTabManager:function(){return new Em},persistentSingleTabManager:Sm,query:jp,queryEqual:qf,querySnapshotFromJSON:function(e,t,n){if(_n(t,cm._jsonSchema)){if(t.bundle===im)throw new Bt(jt.INVALID_ARGUMENT,"The provided JSON object was created in a client environment, which is not supported.");const r=dh(e._databaseId),i=Nf(t.bundle,r),s=i.Ku(),o=new gd(i.getMetadata(),r);for(const e of s)o.Wa(e);if(1!==o.queries.length)throw new Bt(jt.INVALID_ARGUMENT,`Snapshot data expected 1 query but found ${o.queries.length} queries.`);const a=kc(o.queries[0].bundledQuery),c=o.documents;let u=new ed;c.map(e=>{const t=rc(r,e.document);u=u.add(t)});const l=nd.fromInitialDocuments(a,u,Oo(),!1,!1),h=new Ff(e,n||null,a);return new cm(e,new nm(e),h,l)}},refEqual:function(e,t){return e=V(e),t=V(t),(e instanceof Vf||e instanceof Uf)&&(t instanceof Vf||t instanceof Uf)&&e.firestore===t.firestore&&e.path===t.path&&e.converter===t.converter},runTransaction:function(e,t,n){e=wn(e,Wf);const r=Object.assign(Object.assign({},Cm),n);return function(e){if(e.maxAttempts<1)throw new Bt(jt.INVALID_ARGUMENT,"Max attempts must be at least 1")}(r),function(e,t,n){const r=new qt;return e.asyncQueue.enqueueAndForget(async()=>{const i=await Ef(e);new ff(e.asyncQueue,i,n,t,r).zu()}),r.promise}(Jf(e),n=>t(new Dm(e,n)),r)},serverTimestamp:function(){return new vp("serverTimestamp")},setDoc:fm,setIndexConfiguration:
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e,t){const n=Jf(e=wn(e,Wf));return n._uninitializedComponentsProvider&&"memory"!==n._uninitializedComponentsProvider._offline.kind?function(e,t){return e.asyncQueue.enqueue(async()=>async function(e,t){const n=Ut(e),r=n.indexManager,i=[];return n.persistence.runTransaction("Configure indexes","readwrite",e=>r.getFieldIndexes(e).next(n=>
/**
      * @license
      * Copyright 2017 Google LLC
      *
      * Licensed under the Apache License, Version 2.0 (the "License");
      * you may not use this file except in compliance with the License.
      * You may obtain a copy of the License at
      *
      *   http://www.apache.org/licenses/LICENSE-2.0
      *
      * Unless required by applicable law or agreed to in writing, software
      * distributed under the License is distributed on an "AS IS" BASIS,
      * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
      * See the License for the specific language governing permissions and
      * limitations under the License.
      */function(e,t,n,r,i){e=[...e],t=[...t],e.sort(n),t.sort(n);const s=e.length,o=t.length;let a=0,c=0;for(;a<o&&c<s;){const s=n(e[c],t[a]);s<0?i(e[c++]):s>0?r(t[a++]):(a++,c++)}for(;a<o;)r(t[a++]);for(;c<s;)i(e[c++])}(n,t,xn,t=>{i.push(r.addFieldIndex(e,t))},t=>{i.push(r.deleteFieldIndex(e,t))})).next(()=>qn.waitFor(i)))}(await If(e),t))}(n,function(e){const t="string"==typeof e?function(e){try{return JSON.parse(e)}catch(t){throw new Bt(jt.INVALID_ARGUMENT,"Failed to parse JSON: "+(null==t?void 0:t.message))}}(e):e,n=[];if(Array.isArray(t.indexes))for(const r of t.indexes){const e=xm(r,"collectionGroup"),t=[];if(Array.isArray(r.fields))for(const n of r.fields){const e=xp("setIndexConfiguration",xm(n,"fieldPath"));"CONTAINS"===n.arrayConfig?t.push(new Rn(e,2)):"ASCENDING"===n.order?t.push(new Rn(e,0)):"DESCENDING"===n.order&&t.push(new Rn(e,1))}n.push(new kn(kn.UNKNOWN_ID,e,t,Pn.empty()))}return n}(t)):(Pt("Cannot enable indexes when persistence is disabled"),Promise.resolve())},setLogLevel:function(e){Dt.setLogLevel(e)},snapshotEqual:function(e,t){return e instanceof om&&t instanceof om?e._firestore===t._firestore&&e._key.isEqual(t._key)&&(null===e._document?null===t._document:e._document.isEqual(t._document))&&e._converter===t._converter:e instanceof cm&&t instanceof cm&&e._firestore===t._firestore&&qf(e.query,t.query)&&e.metadata.isEqual(t.metadata)&&e._snapshot.isEqual(t._snapshot)},startAfter:function(...e){return Hp._create("startAfter",e,!1)},startAt:function(...e){return Hp._create("startAt",e,!0)},sum:function(e){return new tp("sum",Np("sum",e))},terminate:function(e){return function(e,t,n=ze){Je(e,t).clearInstance(n)}(e.app,"firestore",e._databaseId.database),e._delete()},updateDoc:function(e,t,n,...r){e=wn(e,Vf);const i=wn(e.firestore,Wf),s=pp(i);let o;return o="string"==typeof(t=V(t))||t instanceof ip?Tp(s,"updateDoc",e._key,t,n,r):_p(s,"updateDoc",e._key,t),gm(i,[o.toMutation(e._key,Zo.exists(!0))])},vector:function(e){return new ap(e)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */,waitForPendingWrites:function(e){return function(e){const t=new qt;return e.asyncQueue.enqueueAndForget(async()=>async function(t,n){const r=Ut(t);xh(r.remoteStore)||Rt(Id,"The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");try{const e=await function(e){const t=Ut(e);return t.persistence.runTransaction("Get highest unacknowledged batch id","readonly",e=>t.mutationQueue.getHighestUnacknowledgedBatchId(e))}(r.localStore);if(e===ir)return void n.resolve();const t=r.Vu.get(e)||[];t.push(n),r.Vu.set(e,t)}catch(e){const r=Zh(e,"Initialization of waitForPendingWrites() operation failed");n.reject(r)}}(await Tf(e),t)),t.promise}(Jf(e=wn(e,Wf)))},where:function(e,t,n){const r=t,i=Mp("where",e);return Bp._create(i,r,n)},writeBatch:function(e){return Jf(e=wn(e,Wf)),new Am(e,t=>gm(e,t))}},Symbol.toStringTag,{value:"Module"}));function Vm(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n}function Um(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}"function"==typeof SuppressedError&&SuppressedError;const jm=Um,Bm=new k("auth","Firebase",{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}),qm=new Q("@firebase/auth");function zm(e,...t){qm.logLevel<=z.ERROR&&qm.error(`Auth (${et}): ${e}`,...t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $m(e,...t){throw Wm(e,...t)}function Km(e,...t){return Wm(e,...t)}function Gm(e,t,n){const r=Object.assign(Object.assign({},jm()),{[t]:n});return new k("auth","Firebase",r).create(t,{appName:e.name})}function Hm(e){return Gm(e,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Wm(e,...t){if("string"!=typeof e){const n=t[0],r=[...t.slice(1)];return r[0]&&(r[0].appName=e.name),e._errorFactory.create(n,...r)}return Bm.create(e,...t)}function Qm(e,t,...n){if(!e)throw Wm(t,...n)}function Jm(e){const t="INTERNAL ASSERTION FAILED: "+e;throw zm(t),new Error(t)}function Xm(e,t){e||Jm(t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ym(){var e;return"undefined"!=typeof self&&(null===(e=self.location)||void 0===e?void 0:e.href)||""}function Zm(){var e;return"undefined"!=typeof self&&(null===(e=self.location)||void 0===e?void 0:e.protocol)||null}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eg(){return"undefined"==typeof navigator||!navigator||!("onLine"in navigator)||"boolean"!=typeof navigator.onLine||"http:"!==Zm()&&"https:"!==Zm()&&!I()&&!("connection"in navigator)||navigator.onLine}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class tg{constructor(e,t){this.shortDelay=e,this.longDelay=t,Xm(t>e,"Short delay should be less than long delay!"),this.isMobile="undefined"!=typeof window&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(w())||"object"==typeof navigator&&"ReactNative"===navigator.product}get(){return eg()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ng(e,t){Xm(e.emulator,"Emulator should always be set here");const{url:n}=e.emulator;return t?`${n}${t.startsWith("/")?t.slice(1):t}`:n}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rg{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){return this.fetchImpl?this.fetchImpl:"undefined"!=typeof self&&"fetch"in self?self.fetch:"undefined"!=typeof globalThis&&globalThis.fetch?globalThis.fetch:"undefined"!=typeof fetch?fetch:void Jm("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){return this.headersImpl?this.headersImpl:"undefined"!=typeof self&&"Headers"in self?self.Headers:"undefined"!=typeof globalThis&&globalThis.Headers?globalThis.Headers:"undefined"!=typeof Headers?Headers:void Jm("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){return this.responseImpl?this.responseImpl:"undefined"!=typeof self&&"Response"in self?self.Response:"undefined"!=typeof globalThis&&globalThis.Response?globalThis.Response:"undefined"!=typeof Response?Response:void Jm("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ig={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"},sg=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],og=new tg(3e4,6e4);
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ag(e,t){return e.tenantId&&!t.tenantId?Object.assign(Object.assign({},t),{tenantId:e.tenantId}):t}async function cg(e,t,n,r,i={}){return ug(e,i,async()=>{let i={},s={};r&&("GET"===t?s=r:i={body:JSON.stringify(r)});const o=R(Object.assign({key:e.config.apiKey},s)).slice(1),a=await e._getAdditionalHeaders();a["Content-Type"]="application/json",e.languageCode&&(a["X-Firebase-Locale"]=e.languageCode);const c=Object.assign({method:t,headers:a},i);return"undefined"!=typeof navigator&&"Cloudflare-Workers"===navigator.userAgent||(c.referrerPolicy="no-referrer"),e.emulatorConfig&&f(e.emulatorConfig.host)&&(c.credentials="include"),rg.fetch()(await hg(e,e.config.apiHost,n,o),c)})}async function ug(e,t,n){e._canInitEmulator=!1;const r=Object.assign(Object.assign({},ig),t);try{const t=new fg(e),i=await Promise.race([n(),t.promise]);t.clearNetworkTimeout();const s=await i.json();if("needConfirmation"in s)throw pg(e,"account-exists-with-different-credential",s);if(i.ok&&!("errorMessage"in s))return s;{const t=i.ok?s.errorMessage:s.error.message,[n,o]=t.split(" : ");if("FEDERATED_USER_ID_ALREADY_LINKED"===n)throw pg(e,"credential-already-in-use",s);if("EMAIL_EXISTS"===n)throw pg(e,"email-already-in-use",s);if("USER_DISABLED"===n)throw pg(e,"user-disabled",s);const a=r[n]||n.toLowerCase().replace(/[_\s]+/g,"-");if(o)throw Gm(e,a,o);$m(e,a)}}catch(i){if(i instanceof A)throw i;$m(e,"network-request-failed",{message:String(i)})}}async function lg(e,t,n,r,i={}){const s=await cg(e,t,n,r,i);return"mfaPendingCredential"in s&&$m(e,"multi-factor-auth-required",{_serverResponse:s}),s}async function hg(e,t,n,r){const i=`${t}${n}?${r}`,s=e,o=s.config.emulator?ng(e.config,i):`${e.config.apiScheme}://${i}`;if(sg.includes(n)&&(await s._persistenceManagerAvailable,"COOKIE"===s._getPersistenceType())){return s._getPersistence()._getFinalTarget(o).toString()}return o}function dg(e){switch(e){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class fg{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((e,t)=>{this.timer=setTimeout(()=>t(Km(this.auth,"network-request-failed")),og.get())})}}function pg(e,t,n){const r={appName:e.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=Km(e,t,r);return i.customData._tokenResponse=n,i}function mg(e){return void 0!==e&&void 0!==e.enterprise}class gg{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],void 0===e.recaptchaKey)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||0===this.recaptchaEnforcementState.length)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return dg(t.enforcementState);return null}isProviderEnabled(e){return"ENFORCE"===this.getProviderEnforcementState(e)||"AUDIT"===this.getProviderEnforcementState(e)}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function yg(e,t){return cg(e,"POST","/v1/accounts:lookup",t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vg(e){if(e)try{const t=new Date(Number(e));if(!isNaN(t.getTime()))return t.toUTCString()}catch(t){}}function wg(e){return 1e3*Number(e)}function bg(e){const[t,n,r]=e.split(".");if(void 0===t||void 0===n||void 0===r)return zm("JWT malformed, contained fewer than 3 sections"),null;try{const e=s(n);return e?JSON.parse(e):(zm("Failed to decode base64 JWT payload"),null)}catch(i){return zm("Caught error parsing JWT payload as JSON",null==i?void 0:i.toString()),null}}function Ig(e){const t=bg(e);return Qm(t,"internal-error"),Qm(void 0!==t.exp,"internal-error"),Qm(void 0!==t.iat,"internal-error"),Number(t.exp)-Number(t.iat)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _g(e,t,n=!1){if(n)return t;try{return await t}catch(r){throw r instanceof A&&function({code:e}){return"auth/user-disabled"===e||"auth/user-token-expired"===e}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(r)&&e.auth.currentUser===e&&await e.auth.signOut(),r}}class Tg{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,null!==this.timerId&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const e=this.errorBackoff;return this.errorBackoff=Math.min(2*this.errorBackoff,96e4),e}{this.errorBackoff=3e4;const e=(null!==(t=this.user.stsTokenManager.expirationTime)&&void 0!==t?t:0)-Date.now()-3e5;return Math.max(0,e)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){return void("auth/network-request-failed"===(null==e?void 0:e.code)&&this.schedule(!0))}this.schedule()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eg{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=vg(this.lastLoginAt),this.creationTime=vg(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Sg(e){var t;const n=e.auth,r=await e.getIdToken(),i=await _g(e,yg(n,{idToken:r}));Qm(null==i?void 0:i.users.length,n,"internal-error");const s=i.users[0];e._notifyReloadListener(s);const o=(null===(t=s.providerUserInfo)||void 0===t?void 0:t.length)?Cg(s.providerUserInfo):[],a=(c=e.providerData,u=o,[...c.filter(e=>!u.some(t=>t.providerId===e.providerId)),...u]);var c,u;const l=e.isAnonymous,h=!(e.email&&s.passwordHash||(null==a?void 0:a.length)),d=!!l&&h,f={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:a,metadata:new Eg(s.createdAt,s.lastLoginAt),isAnonymous:d};Object.assign(e,f)}function Cg(e){return e.map(e=>{var{providerId:t}=e,n=Vm(e,["providerId"]);return{providerId:t,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ag{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){Qm(e.idToken,"internal-error"),Qm(void 0!==e.idToken,"internal-error"),Qm(void 0!==e.refreshToken,"internal-error");const t="expiresIn"in e&&void 0!==e.expiresIn?Number(e.expiresIn):Ig(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){Qm(0!==e.length,"internal-error");const t=Ig(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return t||!this.accessToken||this.isExpired?(Qm(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null):this.accessToken}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:r,expiresIn:i}=await async function(e,t){const n=await ug(e,{},async()=>{const n=R({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:r,apiKey:i}=e.config,s=await hg(e,r,"/v1/token",`key=${i}`),o=await e._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const a={method:"POST",headers:o,body:n};return e.emulatorConfig&&f(e.emulatorConfig.host)&&(a.credentials="include"),rg.fetch()(s,a)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}(e,t);this.updateTokensAndExpiration(n,r,Number(i))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+1e3*n}static fromJSON(e,t){const{refreshToken:n,accessToken:r,expirationTime:i}=t,s=new Ag;return n&&(Qm("string"==typeof n,"internal-error",{appName:e}),s.refreshToken=n),r&&(Qm("string"==typeof r,"internal-error",{appName:e}),s.accessToken=r),i&&(Qm("number"==typeof i,"internal-error",{appName:e}),s.expirationTime=i),s}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Ag,this.toJSON())}_performRefresh(){return Jm("not implemented")}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kg(e,t){Qm("string"==typeof e||void 0===e,"internal-error",{appName:t})}class Ng{constructor(e){var{uid:t,auth:n,stsTokenManager:r}=e,i=Vm(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Tg(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Eg(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const t=await _g(this,this.stsTokenManager.getToken(this.auth,e));return Qm(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return async function(e,t=!1){const n=V(e),r=await n.getIdToken(t),i=bg(r);Qm(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s="object"==typeof i.firebase?i.firebase:void 0,o=null==s?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:vg(wg(i.auth_time)),issuedAtTime:vg(wg(i.iat)),expirationTime:vg(wg(i.exp)),signInProvider:o||null,signInSecondFactor:(null==s?void 0:s.sign_in_second_factor)||null}}(this,e)}reload(){return async function(e){const t=V(e);await Sg(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}(this)}_assign(e){this!==e&&(Qm(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(e=>Object.assign({},e)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Ng(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){Qm(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await Sg(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Xe(this.auth.app))return Promise.reject(Hm(this.auth));const e=await this.getIdToken();return await _g(this,
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function(e,t){return cg(e,"POST","/v1/accounts:delete",t)}(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var n,r,i,s,o,a,c,u;const l=null!==(n=t.displayName)&&void 0!==n?n:void 0,h=null!==(r=t.email)&&void 0!==r?r:void 0,d=null!==(i=t.phoneNumber)&&void 0!==i?i:void 0,f=null!==(s=t.photoURL)&&void 0!==s?s:void 0,p=null!==(o=t.tenantId)&&void 0!==o?o:void 0,m=null!==(a=t._redirectEventId)&&void 0!==a?a:void 0,g=null!==(c=t.createdAt)&&void 0!==c?c:void 0,y=null!==(u=t.lastLoginAt)&&void 0!==u?u:void 0,{uid:v,emailVerified:w,isAnonymous:b,providerData:I,stsTokenManager:_}=t;Qm(v&&_,e,"internal-error");const T=Ag.fromJSON(this.name,_);Qm("string"==typeof v,e,"internal-error"),kg(l,e.name),kg(h,e.name),Qm("boolean"==typeof w,e,"internal-error"),Qm("boolean"==typeof b,e,"internal-error"),kg(d,e.name),kg(f,e.name),kg(p,e.name),kg(m,e.name),kg(g,e.name),kg(y,e.name);const E=new Ng({uid:v,auth:e,email:h,emailVerified:w,displayName:l,isAnonymous:b,photoURL:f,phoneNumber:d,tenantId:p,stsTokenManager:T,createdAt:g,lastLoginAt:y});return I&&Array.isArray(I)&&(E.providerData=I.map(e=>Object.assign({},e))),m&&(E._redirectEventId=m),E}static async _fromIdTokenResponse(e,t,n=!1){const r=new Ag;r.updateFromServerResponse(t);const i=new Ng({uid:t.localId,auth:e,stsTokenManager:r,isAnonymous:n});return await Sg(i),i}static async _fromGetAccountInfoResponse(e,t,n){const r=t.users[0];Qm(void 0!==r.localId,"internal-error");const i=void 0!==r.providerUserInfo?Cg(r.providerUserInfo):[],s=!(r.email&&r.passwordHash||(null==i?void 0:i.length)),o=new Ag;o.updateFromIdToken(n);const a=new Ng({uid:r.localId,auth:e,stsTokenManager:o,isAnonymous:s}),c={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:i,metadata:new Eg(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash||(null==i?void 0:i.length))};return Object.assign(a,c),a}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dg=new Map;function xg(e){Xm(e instanceof Function,"Expected a class definition");let t=Dg.get(e);return t?(Xm(t instanceof e,"Instance stored in cache mismatched with class"),t):(t=new e,Dg.set(e,t),t)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rg{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return void 0===t?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Rg.type="NONE";const Og=Rg;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pg(e,t,n){return`firebase:${e}:${t}:${n}`}class Lg{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:r,name:i}=this.auth;this.fullUserKey=Pg(this.userKey,r.apiKey,i),this.fullPersistenceKey=Pg("persistence",r.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if("string"==typeof e){const t=await yg(this.auth,{idToken:e}).catch(()=>{});return t?Ng._fromGetAccountInfoResponse(this.auth,t,e):null}return Ng._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();return await this.removeCurrentUser(),this.persistence=e,t?this.setCurrentUser(t):void 0}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,n="authUser"){if(!t.length)return new Lg(xg(Og),e,n);const r=(await Promise.all(t.map(async e=>{if(await e._isAvailable())return e}))).filter(e=>e);let i=r[0]||xg(Og);const s=Pg(n,e.config.apiKey,e.name);let o=null;for(const u of t)try{const t=await u._get(s);if(t){let n;if("string"==typeof t){const r=await yg(e,{idToken:t}).catch(()=>{});if(!r)break;n=await Ng._fromGetAccountInfoResponse(e,r,t)}else n=Ng._fromJSON(e,t);u!==i&&(o=n),i=u;break}}catch(c){}const a=r.filter(e=>e._shouldAllowMigration);return i._shouldAllowMigration&&a.length?(i=a[0],o&&await i._set(s,o.toJSON()),await Promise.all(t.map(async e=>{if(e!==i)try{await e._remove(s)}catch(c){}})),new Lg(i,e,n)):new Lg(i,e,n)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mg(e){const t=e.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(jg(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if(Fg(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(qg(t))return"Blackberry";if(zg(t))return"Webos";if(Vg(t))return"Safari";if((t.includes("chrome/")||Ug(t))&&!t.includes("edge/"))return"Chrome";if(Bg(t))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=e.match(t);if(2===(null==n?void 0:n.length))return n[1]}return"Other"}function Fg(e=w()){return/firefox\//i.test(e)}function Vg(e=w()){const t=e.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function Ug(e=w()){return/crios\//i.test(e)}function jg(e=w()){return/iemobile/i.test(e)}function Bg(e=w()){return/android/i.test(e)}function qg(e=w()){return/blackberry/i.test(e)}function zg(e=w()){return/webos/i.test(e)}function $g(e=w()){return/iphone|ipad|ipod/i.test(e)||/macintosh/i.test(e)&&/mobile/i.test(e)}function Kg(){return function(){const e=w();return e.indexOf("MSIE ")>=0||e.indexOf("Trident/")>=0}()&&10===document.documentMode}function Gg(e=w()){return $g(e)||Bg(e)||zg(e)||qg(e)||/windows phone/i.test(e)||jg(e)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hg(e,t=[]){let n;switch(e){case"Browser":n=Mg(w());break;case"Worker":n=`${Mg(w())}-${e}`;break;default:n=e}const r=t.length?t.join(","):"FirebaseCore-web";return`${n}/JsCore/${et}/${r}`}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wg{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=t=>new Promise((n,r)=>{try{n(e(t))}catch(i){r(i)}});n.onAbort=t,this.queue.push(n);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const e of t)try{e()}catch(r){}throw this.auth._errorFactory.create("login-blocked",{originalMessage:null==n?void 0:n.message})}}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qg{constructor(e){var t,n,r,i;const s=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=null!==(t=s.minPasswordLength)&&void 0!==t?t:6,s.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=s.maxPasswordLength),void 0!==s.containsLowercaseCharacter&&(this.customStrengthOptions.containsLowercaseLetter=s.containsLowercaseCharacter),void 0!==s.containsUppercaseCharacter&&(this.customStrengthOptions.containsUppercaseLetter=s.containsUppercaseCharacter),void 0!==s.containsNumericCharacter&&(this.customStrengthOptions.containsNumericCharacter=s.containsNumericCharacter),void 0!==s.containsNonAlphanumericCharacter&&(this.customStrengthOptions.containsNonAlphanumericCharacter=s.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,"ENFORCEMENT_STATE_UNSPECIFIED"===this.enforcementState&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=null!==(r=null===(n=e.allowedNonAlphanumericCharacters)||void 0===n?void 0:n.join(""))&&void 0!==r?r:"",this.forceUpgradeOnSignin=null!==(i=e.forceUpgradeOnSignin)&&void 0!==i&&i,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,n,r,i,s,o;const a={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,a),this.validatePasswordCharacterOptions(e,a),a.isValid&&(a.isValid=null===(t=a.meetsMinPasswordLength)||void 0===t||t),a.isValid&&(a.isValid=null===(n=a.meetsMaxPasswordLength)||void 0===n||n),a.isValid&&(a.isValid=null===(r=a.containsLowercaseLetter)||void 0===r||r),a.isValid&&(a.isValid=null===(i=a.containsUppercaseLetter)||void 0===i||i),a.isValid&&(a.isValid=null===(s=a.containsNumericCharacter)||void 0===s||s),a.isValid&&(a.isValid=null===(o=a.containsNonAlphanumericCharacter)||void 0===o||o),a}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),r&&(t.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,t){let n;this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);for(let r=0;r<e.length;r++)n=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,r,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jg{constructor(e,t,n,r){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Yg(this),this.idTokenSubscription=new Yg(this),this.beforeStateQueue=new Wg(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Bm,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion,this._persistenceManagerAvailable=new Promise(e=>this._resolvePersistenceManagerAvailable=e)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=xg(t)),this._initializationPromise=this.queue(async()=>{var n,r,i;if(!this._deleted&&(this.persistenceManager=await Lg.create(this,e),null===(n=this._resolvePersistenceManagerAvailable)||void 0===n||n.call(this),!this._deleted)){if(null===(r=this._popupRedirectResolver)||void 0===r?void 0:r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch(s){}await this.initializeCurrentUser(t),this.lastNotifiedUid=(null===(i=this.currentUser)||void 0===i?void 0:i.uid)||null,this._deleted||(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();return this.currentUser||e?this.currentUser&&e&&this.currentUser.uid===e.uid?(this._currentUser._assign(e),void(await this.currentUser.getIdToken())):void(await this._updateCurrentUser(e,!0)):void 0}async initializeCurrentUserFromIdToken(e){try{const t=await yg(this,{idToken:e}),n=await Ng._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Xe(this.app)){const e=this.app.settings.authIdToken;return e?new Promise(t=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(e).then(t,t))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const n=null===(t=this.redirectUser)||void 0===t?void 0:t._redirectEventId,s=null==r?void 0:r._redirectEventId,o=await this.tryRedirectSignIn(e);n&&n!==s||!(null==o?void 0:o.user)||(r=o.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(s){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(s))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return Qm(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch(n){await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Sg(e)}catch(t){if("auth/network-request-failed"!==(null==t?void 0:t.code))return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=function(){if("undefined"==typeof navigator)return null;const e=navigator;return e.languages&&e.languages[0]||e.language||null}()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Xe(this.app))return Promise.reject(Hm(this));const t=e?V(e):null;return t&&Qm(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&Qm(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Xe(this.app)?Promise.reject(Hm(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Xe(this.app)?Promise.reject(Hm(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(xg(e))})}_getRecaptchaConfig(){return null==this.tenantId?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return null===this.tenantId?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await async function(e,t={}){return cg(e,"GET","/v2/passwordPolicy",ag(e,t))}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(this),t=new Qg(e);null===this.tenantId?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new k("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:await this.currentUser.getIdToken()};null!=this.tenantId&&(t.tenantId=this.tenantId),await async function(e,t){return cg(e,"POST","/v2/accounts:revokeToken",ag(e,t))}(this,t)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:null===(e=this._currentUser)||void 0===e?void 0:e.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return null===e?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&xg(e)||this._popupRedirectResolver;Qm(t,this,"argument-error"),this.redirectPersistenceManager=await Lg.create(this,[xg(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,n;return this._isInitialized&&await this.queue(async()=>{}),(null===(t=this._currentUser)||void 0===t?void 0:t._redirectEventId)===e?this._currentUser:(null===(n=this.redirectUser)||void 0===n?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const n=null!==(t=null===(e=this.currentUser)||void 0===e?void 0:e.uid)&&void 0!==t?t:null;this.lastNotifiedUid!==n&&(this.lastNotifiedUid=n,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,r){if(this._deleted)return()=>{};const i="function"==typeof t?t:t.next.bind(t);let s=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(Qm(o,this,"internal-error"),o.then(()=>{s||i(this.currentUser)}),"function"==typeof t){const i=e.addObserver(t,n,r);return()=>{s=!0,i()}}{const n=e.addObserver(t);return()=>{s=!0,n()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return Qm(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){e&&!this.frameworks.includes(e)&&(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Hg(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const n=await(null===(e=this.heartbeatServiceProvider.getImmediate({optional:!0}))||void 0===e?void 0:e.getHeartbeatsHeader());n&&(t["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(t["X-Firebase-AppCheck"]=r),t}async _getAppCheckToken(){var e;if(Xe(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await(null===(e=this.appCheckServiceProvider.getImmediate({optional:!0}))||void 0===e?void 0:e.getToken());return(null==t?void 0:t.error)&&function(e,...t){qm.logLevel<=z.WARN&&qm.warn(`Auth (${et}): ${e}`,...t)}(`Error while retrieving App Check token: ${t.error}`),null==t?void 0:t.token}}function Xg(e){return V(e)}class Yg{constructor(e){this.auth=e,this.observer=null,this.addObserver=function(e,t){const n=new L(e,t);return n.subscribe.bind(n)}(e=>this.observer=e)}get next(){return Qm(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Zg={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function ey(e){return Zg.loadJS(e)}class ty{constructor(){this.enterprise=new ny}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class ny{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}const ry="NO_RECAPTCHA";class iy{constructor(e){this.type="recaptcha-enterprise",this.auth=Xg(e)}async verify(e="verify",t=!1){async function n(e){if(!t){if(null==e.tenantId&&null!=e._agentRecaptchaConfig)return e._agentRecaptchaConfig.siteKey;if(null!=e.tenantId&&void 0!==e._tenantRecaptchaConfigs[e.tenantId])return e._tenantRecaptchaConfigs[e.tenantId].siteKey}return new Promise(async(t,n)=>{(async function(e,t){return cg(e,"GET","/v2/recaptchaConfig",ag(e,t))})(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(r=>{if(void 0!==r.recaptchaKey){const n=new gg(r);return null==e.tenantId?e._agentRecaptchaConfig=n:e._tenantRecaptchaConfigs[e.tenantId]=n,t(n.siteKey)}n(new Error("recaptcha Enterprise site key undefined"))}).catch(e=>{n(e)})})}function r(t,n,r){const i=window.grecaptcha;mg(i)?i.enterprise.ready(()=>{i.enterprise.execute(t,{action:e}).then(e=>{n(e)}).catch(()=>{n(ry)})}):r(Error("No reCAPTCHA enterprise script loaded."))}if(this.auth.settings.appVerificationDisabledForTesting){return(new ty).execute("siteKey",{action:"verify"})}return new Promise((e,i)=>{n(this.auth).then(n=>{if(!t&&mg(window.grecaptcha))r(n,e,i);else{if("undefined"==typeof window)return void i(new Error("RecaptchaVerifier is only supported in browser"));let t=Zg.recaptchaEnterpriseScript;0!==t.length&&(t+=n),ey(t).then(()=>{r(n,e,i)}).catch(e=>{i(e)})}}).catch(e=>{i(e)})})}}async function sy(e,t,n,r=!1,i=!1){const s=new iy(e);let o;if(i)o=ry;else try{o=await s.verify(n)}catch(c){o=await s.verify(n,!0)}const a=Object.assign({},t);if("mfaSmsEnrollment"===n||"mfaSmsSignIn"===n){if("phoneEnrollmentInfo"in a){const e=a.phoneEnrollmentInfo.phoneNumber,t=a.phoneEnrollmentInfo.recaptchaToken;Object.assign(a,{phoneEnrollmentInfo:{phoneNumber:e,recaptchaToken:t,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in a){const e=a.phoneSignInInfo.recaptchaToken;Object.assign(a,{phoneSignInInfo:{recaptchaToken:e,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return a}return r?Object.assign(a,{captchaResp:o}):Object.assign(a,{captchaResponse:o}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function oy(e,t,n,r,i){var s;if(null===(s=e._getRecaptchaConfig())||void 0===s?void 0:s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const i=await sy(e,t,n,"getOobCode"===n);return r(e,i)}return r(e,t).catch(async i=>{if("auth/missing-recaptcha-token"===i.code){const i=await sy(e,t,n,"getOobCode"===n);return r(e,i)}return Promise.reject(i)})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ay(e,t,n){const r=Xg(e);Qm(/^https?:\/\//.test(t),r,"invalid-emulator-scheme");const i=cy(t),{host:s,port:o}=function(e){const t=cy(e),n=/(\/\/)?([^?#/]+)/.exec(e.substr(t.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const e=i[1];return{host:e,port:uy(r.substr(e.length+1))}}{const[e,t]=r.split(":");return{host:e,port:uy(t)}}}(t),a=null===o?"":`:${o}`,c={url:`${i}//${s}${a}/`},u=Object.freeze({host:s,port:o,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:!1})});if(!r._canInitEmulator)return Qm(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),void Qm(D(c,r.config.emulator)&&D(u,r.emulatorConfig),r,"emulator-config-failed");r.config.emulator=c,r.emulatorConfig=u,r.settings.appVerificationDisabledForTesting=!0,f(s)?(p(`${i}//${s}${a}`),v("Auth",!0)):function(){function e(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}"undefined"!=typeof console&&console.info;"undefined"!=typeof window&&"undefined"!=typeof document&&("loading"===document.readyState?window.addEventListener("DOMContentLoaded",e):e())}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */()}function cy(e){const t=e.indexOf(":");return t<0?"":e.substr(0,t+1)}function uy(e){if(!e)return null;const t=Number(e);return isNaN(t)?null:t}class ly{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Jm("not implemented")}_getIdTokenResponse(e){return Jm("not implemented")}_linkToIdToken(e,t){return Jm("not implemented")}_getReauthenticationResolver(e){return Jm("not implemented")}}async function hy(e,t){return cg(e,"POST","/v1/accounts:signUp",t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function dy(e,t){return lg(e,"POST","/v1/accounts:signInWithPassword",ag(e,t))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class fy extends ly{constructor(e,t,n,r=null){super("password",n),this._email=e,this._password=t,this._tenantId=r}static _fromEmailAndPassword(e,t){return new fy(e,t,"password")}static _fromEmailAndCode(e,t,n=null){return new fy(e,t,"emailLink",n)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t="string"==typeof e?JSON.parse(e):e;if((null==t?void 0:t.email)&&(null==t?void 0:t.password)){if("password"===t.signInMethod)return this._fromEmailAndPassword(t.email,t.password);if("emailLink"===t.signInMethod)return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":return oy(e,{returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"},"signInWithPassword",dy);case"emailLink":return async function(e,t){return lg(e,"POST","/v1/accounts:signInWithEmailLink",ag(e,t))}(e,{email:this._email,oobCode:this._password});default:$m(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":return oy(e,{idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",hy);case"emailLink":return async function(e,t){return lg(e,"POST","/v1/accounts:signInWithEmailLink",ag(e,t))}(e,{idToken:t,email:this._email,oobCode:this._password});default:$m(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function py(e,t){return lg(e,"POST","/v1/accounts:signInWithIdp",ag(e,t))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class my extends ly{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new my(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):$m("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t="string"==typeof e?JSON.parse(e):e,{providerId:n,signInMethod:r}=t,i=Vm(t,["providerId","signInMethod"]);if(!n||!r)return null;const s=new my(n,r);return s.idToken=i.idToken||void 0,s.accessToken=i.accessToken||void 0,s.secret=i.secret,s.nonce=i.nonce,s.pendingToken=i.pendingToken||null,s}_getIdTokenResponse(e){return py(e,this.buildRequest())}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,py(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,py(e,t)}buildRequest(){const e={requestUri:"http://localhost",returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=R(t)}return e}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gy{constructor(e){var t,n,r,i,s,o;const a=O(P(e)),c=null!==(t=a.apiKey)&&void 0!==t?t:null,u=null!==(n=a.oobCode)&&void 0!==n?n:null,l=function(e){switch(e){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}(null!==(r=a.mode)&&void 0!==r?r:null);Qm(c&&u&&l,"argument-error"),this.apiKey=c,this.operation=l,this.code=u,this.continueUrl=null!==(i=a.continueUrl)&&void 0!==i?i:null,this.languageCode=null!==(s=a.lang)&&void 0!==s?s:null,this.tenantId=null!==(o=a.tenantId)&&void 0!==o?o:null}static parseLink(e){const t=function(e){const t=O(P(e)).link,n=t?O(P(t)).deep_link_id:null,r=O(P(e)).deep_link_id;return(r?O(P(r)).link:null)||r||n||t||e}(e);try{return new gy(t)}catch(n){return null}}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yy{constructor(){this.providerId=yy.PROVIDER_ID}static credential(e,t){return fy._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const n=gy.parseLink(t);return Qm(n,"argument-error"),fy._fromEmailAndCode(e,n.code,n.tenantId)}}yy.PROVIDER_ID="password",yy.EMAIL_PASSWORD_SIGN_IN_METHOD="password",yy.EMAIL_LINK_SIGN_IN_METHOD="emailLink";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class vy{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wy extends vy{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class by extends wy{constructor(){super("facebook.com")}static credential(e){return my._fromParams({providerId:by.PROVIDER_ID,signInMethod:by.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return by.credentialFromTaggedObject(e)}static credentialFromError(e){return by.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e))return null;if(!e.oauthAccessToken)return null;try{return by.credential(e.oauthAccessToken)}catch(t){return null}}}by.FACEBOOK_SIGN_IN_METHOD="facebook.com",by.PROVIDER_ID="facebook.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Iy extends wy{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return my._fromParams({providerId:Iy.PROVIDER_ID,signInMethod:Iy.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Iy.credentialFromTaggedObject(e)}static credentialFromError(e){return Iy.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n}=e;if(!t&&!n)return null;try{return Iy.credential(t,n)}catch(r){return null}}}Iy.GOOGLE_SIGN_IN_METHOD="google.com",Iy.PROVIDER_ID="google.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class _y extends wy{constructor(){super("github.com")}static credential(e){return my._fromParams({providerId:_y.PROVIDER_ID,signInMethod:_y.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return _y.credentialFromTaggedObject(e)}static credentialFromError(e){return _y.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e))return null;if(!e.oauthAccessToken)return null;try{return _y.credential(e.oauthAccessToken)}catch(t){return null}}}_y.GITHUB_SIGN_IN_METHOD="github.com",_y.PROVIDER_ID="github.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ty extends wy{constructor(){super("twitter.com")}static credential(e,t){return my._fromParams({providerId:Ty.PROVIDER_ID,signInMethod:Ty.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Ty.credentialFromTaggedObject(e)}static credentialFromError(e){return Ty.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:n}=e;if(!t||!n)return null;try{return Ty.credential(t,n)}catch(r){return null}}}Ty.TWITTER_SIGN_IN_METHOD="twitter.com",Ty.PROVIDER_ID="twitter.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ey{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,r=!1){const i=await Ng._fromIdTokenResponse(e,n,r),s=Sy(n);return new Ey({user:i,providerId:s,_tokenResponse:n,operationType:t})}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const r=Sy(n);return new Ey({user:e,providerId:r,_tokenResponse:n,operationType:t})}}function Sy(e){return e.providerId?e.providerId:"phoneNumber"in e?"phone":null}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cy extends A{constructor(e,t,n,r){var i;super(t.code,t.message),this.operationType=n,this.user=r,Object.setPrototypeOf(this,Cy.prototype),this.customData={appName:e.name,tenantId:null!==(i=e.tenantId)&&void 0!==i?i:void 0,_serverResponse:t.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,t,n,r){return new Cy(e,t,n,r)}}function Ay(e,t,n,r){return("reauthenticate"===t?n._getReauthenticationResolver(e):n._getIdTokenResponse(e)).catch(n=>{if("auth/multi-factor-auth-required"===n.code)throw Cy._fromErrorAndOperation(e,n,t,r);throw n})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function ky(e,t,n=!1){if(Xe(e.app))return Promise.reject(Hm(e));const r="signIn",i=await Ay(e,r,t),s=await Ey._fromIdTokenResponse(e,r,i);return n||await e._updateCurrentUser(s.user),s}function Ny(e,t,n){return Xe(e.app)?Promise.reject(Hm(e)):async function(e,t){return ky(Xg(e),t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(V(e),yy.credential(t,n)).catch(async t=>{throw"auth/password-does-not-meet-requirements"===t.code&&async function(e){const t=Xg(e);t._getPasswordPolicyInternal()&&await t._updatePasswordPolicy()}(e),t})}function Dy(e,t,n,r){return V(e).onAuthStateChanged(t,n,r)}function xy(e){return V(e).signOut()}const Ry="__sak";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oy{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Ry,"1"),this.storage.removeItem(Ry),Promise.resolve(!0)):Promise.resolve(!1)}catch(e){return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Py extends Oy{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Gg(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),r=this.localCache[t];n!==r&&e(t,r,n)}}onStorageEvent(e,t=!1){if(!e.key)return void this.forAllChangedKeys((e,t,n)=>{this.notifyListeners(e,n)});const n=e.key;t?this.detachListener():this.stopPolling();const r=()=>{const e=this.storage.getItem(n);(t||this.localCache[n]!==e)&&this.notifyListeners(n,e)},i=this.storage.getItem(n);Kg()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,10):r()}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const r of Array.from(n))r(t?JSON.parse(t):t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)})},1e3)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){0===Object.keys(this.listeners).length&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Py.type="LOCAL";const Ly=Py;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class My extends Oy{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}My.type="SESSION";const Fy=My;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Vy{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(t=>t.isListeningto(e));if(t)return t;const n=new Vy(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:r,data:i}=t.data,s=this.handlersMap[r];if(!(null==s?void 0:s.size))return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:r});const o=Array.from(s).map(async e=>e(t.origin,i)),a=await function(e){return Promise.all(e.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}(o);t.ports[0].postMessage({status:"done",eventId:n,eventType:r,response:a})}_subscribe(e,t){0===Object.keys(this.handlersMap).length&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),t&&0!==this.handlersMap[e].size||delete this.handlersMap[e],0===Object.keys(this.handlersMap).length&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Uy(e="",t=10){let n="";for(let r=0;r<t;r++)n+=Math.floor(10*Math.random());return e+n}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Vy.receivers=[];class jy{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const r="undefined"!=typeof MessageChannel?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let i,s;return new Promise((o,a)=>{const c=Uy("",20);r.port1.start();const u=setTimeout(()=>{a(new Error("unsupported_event"))},n);s={messageChannel:r,onMessage(e){const t=e;if(t.data.eventId===c)switch(t.data.status){case"ack":clearTimeout(u),i=setTimeout(()=>{a(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),o(t.data.response);break;default:clearTimeout(u),clearTimeout(i),a(new Error("invalid_response"))}}},this.handlers.add(s),r.port1.addEventListener("message",s.onMessage),this.target.postMessage({eventType:e,eventId:c,data:t},[r.port2])}).finally(()=>{s&&this.removeMessageHandler(s)})}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function By(){return window}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function qy(){return void 0!==By().WorkerGlobalScope&&"function"==typeof By().importScripts}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const zy="firebaseLocalStorageDb",$y="firebaseLocalStorage",Ky="fbase_key";class Gy{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Hy(e,t){return e.transaction([$y],t?"readwrite":"readonly").objectStore($y)}function Wy(){const e=indexedDB.open(zy,1);return new Promise((t,n)=>{e.addEventListener("error",()=>{n(e.error)}),e.addEventListener("upgradeneeded",()=>{const t=e.result;try{t.createObjectStore($y,{keyPath:Ky})}catch(r){n(r)}}),e.addEventListener("success",async()=>{const n=e.result;n.objectStoreNames.contains($y)?t(n):(n.close(),await function(){const e=indexedDB.deleteDatabase(zy);return new Gy(e).toPromise()}(),t(await Wy()))})})}async function Qy(e,t,n){const r=Hy(e,!0).put({[Ky]:t,value:n});return new Gy(r).toPromise()}function Jy(e,t){const n=Hy(e,!0).delete(t);return new Gy(n).toPromise()}class Xy{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db||(this.db=await Wy()),this.db}async _withRetries(e){let t=0;for(;;)try{const t=await this._openDb();return await e(t)}catch(n){if(t++>3)throw n;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return qy()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Vy._getInstance(qy()?self:null),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await async function(){if(!(null===navigator||void 0===navigator?void 0:navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch(e){return null}}(),!this.activeServiceWorker)return;this.sender=new jy(this.activeServiceWorker);const n=await this.sender._send("ping",{},800);n&&(null===(e=n[0])||void 0===e?void 0:e.fulfilled)&&(null===(t=n[0])||void 0===t?void 0:t.value.includes("keyChanged"))&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){var t;if(this.sender&&this.activeServiceWorker&&((null===(t=null===navigator||void 0===navigator?void 0:navigator.serviceWorker)||void 0===t?void 0:t.controller)||null)===this.activeServiceWorker)try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch(t){}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Wy();return await Qy(e,Ry,"1"),await Jy(e,Ry),!0}catch(e){}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(n=>Qy(n,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(t=>async function(e,t){const n=Hy(e,!1).get(t),r=await new Gy(n).toPromise();return void 0===r?null:r.value}(t,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Jy(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(e=>{const t=Hy(e,!1).getAll();return new Gy(t).toPromise()});if(!e)return[];if(0!==this.pendingWrites)return[];const t=[],n=new Set;if(0!==e.length)for(const{fbase_key:r,value:i}of e)n.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(i)&&(this.notifyListeners(r,i),t.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!n.has(r)&&(this.notifyListeners(r,null),t.push(r));return t}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const r of Array.from(n))r(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),800)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){0===Object.keys(this.listeners).length&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&this.stopPolling()}}Xy.type="LOCAL";const Yy=Xy;new tg(3e4,6e4);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Zy extends ly{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return py(e,this._buildIdpRequest())}_linkToIdToken(e,t){return py(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return py(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function ev(e){return ky(e.auth,new Zy(e),e.bypassAuthState)}function tv(e){const{auth:t,user:n}=e;return Qm(n,t,"internal-error"),
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function(e,t,n=!1){const{auth:r}=e;if(Xe(r.app))return Promise.reject(Hm(r));const i="reauthenticate";try{const s=await _g(e,Ay(r,i,t,e),n);Qm(s.idToken,r,"internal-error");const o=bg(s.idToken);Qm(o,r,"internal-error");const{sub:a}=o;return Qm(e.uid===a,r,"user-mismatch"),Ey._forOperation(e,i,s)}catch(s){throw"auth/user-not-found"===(null==s?void 0:s.code)&&$m(r,"user-mismatch"),s}}(n,new Zy(e),e.bypassAuthState)}async function nv(e){const{auth:t,user:n}=e;return Qm(n,t,"internal-error"),async function(e,t,n=!1){const r=await _g(e,t._linkToIdToken(e.auth,await e.getIdToken()),n);return Ey._forOperation(e,"link",r)}(n,new Zy(e),e.bypassAuthState)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rv{constructor(e,t,n,r,i=!1){this.auth=e,this.resolver=n,this.user=r,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:n,postBody:r,tenantId:i,error:s,type:o}=e;if(s)return void this.reject(s);const a={auth:this.auth,requestUri:t,sessionId:n,tenantId:i||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(a))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return ev;case"linkViaPopup":case"linkViaRedirect":return nv;case"reauthViaPopup":case"reauthViaRedirect":return tv;default:$m(this.auth,"internal-error")}}resolve(e){Xm(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Xm(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iv=new tg(2e3,1e4);class sv extends rv{constructor(e,t,n,r,i){super(e,t,r,i),this.provider=n,this.authWindow=null,this.pollId=null,sv.currentPopupAction&&sv.currentPopupAction.cancel(),sv.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return Qm(e,this.auth,"internal-error"),e}async onExecution(){Xm(1===this.filter.length,"Popup operations only handle one event");const e=Uy();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(e=>{this.reject(e)}),this.resolver._isIframeWebStorageSupported(this.auth,e=>{e||this.reject(Km(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return(null===(e=this.authWindow)||void 0===e?void 0:e.associatedEvent)||null}cancel(){this.reject(Km(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,sv.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,n;(null===(n=null===(t=this.authWindow)||void 0===t?void 0:t.window)||void 0===n?void 0:n.closed)?this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Km(this.auth,"popup-closed-by-user"))},8e3):this.pollId=window.setTimeout(e,iv.get())};e()}}sv.currentPopupAction=null;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ov="pendingRedirect",av=new Map;class cv extends rv{constructor(e,t,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,n),this.eventId=null}async execute(){let e=av.get(this.auth._key());if(!e){try{const t=await async function(e,t){const n=function(e){return Pg(ov,e.config.apiKey,e.name)}(t),r=function(e){return xg(e._redirectPersistence)}(e);if(!(await r._isAvailable()))return!1;const i="true"===await r._get(n);return await r._remove(n),i}(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(t)}catch(t){e=()=>Promise.reject(t)}av.set(this.auth._key(),e)}return this.bypassAuthState||av.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if("signInViaRedirect"===e.type)return super.onAuthEvent(e);if("unknown"!==e.type){if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}else this.resolve(null)}async onExecution(){}cleanUp(){}}function uv(e,t){av.set(e._key(),t)}async function lv(e,t,n=!1){if(Xe(e.app))return Promise.reject(Hm(e));const r=Xg(e),i=
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e,t){return t?xg(t):(Qm(e._popupRedirectResolver,e,"argument-error"),e._popupRedirectResolver)}(r,t),s=new cv(r,i,n),o=await s.execute();return o&&!n&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,t)),o}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hv{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!function(e){switch(e.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return fv(e);default:return!1}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var n;if(e.error&&!fv(e)){const r=(null===(n=e.error.code)||void 0===n?void 0:n.split("auth/")[1])||"internal-error";t.onError(Km(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const n=null===t.eventId||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=6e5&&this.cachedEventUids.clear(),this.cachedEventUids.has(dv(e))}saveEventToCache(e){this.cachedEventUids.add(dv(e)),this.lastProcessedEventTime=Date.now()}}function dv(e){return[e.type,e.eventId,e.sessionId,e.tenantId].filter(e=>e).join("-")}function fv({type:e,error:t}){return"unknown"===e&&"auth/no-auth-event"===(null==t?void 0:t.code)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const pv=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,mv=/^https?/;async function gv(e){if(e.config.emulator)return;const{authorizedDomains:t}=await async function(e,t={}){return cg(e,"GET","/v1/projects",t)}(e);for(const r of t)try{if(yv(r))return}catch(n){}$m(e,"unauthorized-domain")}function yv(e){const t=Ym(),{protocol:n,hostname:r}=new URL(t);if(e.startsWith("chrome-extension://")){const i=new URL(e);return""===i.hostname&&""===r?"chrome-extension:"===n&&e.replace("chrome-extension://","")===t.replace("chrome-extension://",""):"chrome-extension:"===n&&i.hostname===r}if(!mv.test(n))return!1;if(pv.test(e))return r===e;const i=e.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vv=new tg(3e4,6e4);function wv(){const e=By().___jsl;if(null==e?void 0:e.H)for(const t of Object.keys(e.H))if(e.H[t].r=e.H[t].r||[],e.H[t].L=e.H[t].L||[],e.H[t].r=[...e.H[t].L],e.CP)for(let n=0;n<e.CP.length;n++)e.CP[n]=null}function bv(e){return new Promise((t,n)=>{var r,i,s;function o(){wv(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{wv(),n(Km(e,"network-request-failed"))},timeout:vv.get()})}if(null===(i=null===(r=By().gapi)||void 0===r?void 0:r.iframes)||void 0===i?void 0:i.Iframe)t(gapi.iframes.getContext());else{if(!(null===(s=By().gapi)||void 0===s?void 0:s.load)){const t=`__${"iframefcb"}${Math.floor(1e6*Math.random())}`;return By()[t]=()=>{gapi.load?o():n(Km(e,"network-request-failed"))},ey(`${Zg.gapiScript}?onload=${t}`).catch(e=>n(e))}o()}}).catch(e=>{throw Iv=null,e})}let Iv=null;
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const _v=new tg(5e3,15e3),Tv={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Ev=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Sv(e){const t=e.config;Qm(t.authDomain,e,"auth-domain-config-required");const n=t.emulator?ng(t,"emulator/auth/iframe"):`https://${e.config.authDomain}/__/auth/iframe`,r={apiKey:t.apiKey,appName:e.name,v:et},i=Ev.get(e.config.apiHost);i&&(r.eid=i);const s=e._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${R(r).slice(1)}`}async function Cv(e){const t=await function(e){return Iv=Iv||bv(e),Iv}(e),n=By().gapi;return Qm(n,e,"internal-error"),t.open({where:document.body,url:Sv(e),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Tv,dontclear:!0},t=>new Promise(async(n,r)=>{await t.restyle({setHideOnLeave:!1});const i=Km(e,"network-request-failed"),s=By().setTimeout(()=>{r(i)},_v.get());function o(){By().clearTimeout(s),n(t)}t.ping(o).then(o,()=>{r(i)})}))}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Av={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"};class kv{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch(e){}}}function Nv(e,t,n,r=500,i=600){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let a="";const c=Object.assign(Object.assign({},Av),{width:r.toString(),height:i.toString(),top:s,left:o}),u=w().toLowerCase();n&&(a=Ug(u)?"_blank":n),Fg(u)&&(t=t||"http://localhost",c.scrollbars="yes");const l=Object.entries(c).reduce((e,[t,n])=>`${e}${t}=${n},`,"");if(function(e=w()){var t;return $g(e)&&!!(null===(t=window.navigator)||void 0===t?void 0:t.standalone)}(u)&&"_self"!==a)return function(e,t){const n=document.createElement("a");n.href=e,n.target=t;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(t||"",a),new kv(null);const h=window.open(t||"",a,l);Qm(h,e,"popup-blocked");try{h.focus()}catch(d){}return new kv(h)}const Dv="__/auth/handler",xv="emulator/auth/handler",Rv=encodeURIComponent("fac");async function Ov(e,t,n,r,i,s){Qm(e.config.authDomain,e,"auth-domain-config-required"),Qm(e.config.apiKey,e,"invalid-api-key");const o={apiKey:e.config.apiKey,appName:e.name,authType:n,redirectUrl:r,v:et,eventId:i};if(t instanceof vy){t.setDefaultLanguage(e.languageCode),o.providerId=t.providerId||"",function(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}(t.getCustomParameters())||(o.customParameters=JSON.stringify(t.getCustomParameters()));for(const[e,t]of Object.entries({}))o[e]=t}if(t instanceof wy){const e=t.getScopes().filter(e=>""!==e);e.length>0&&(o.scopes=e.join(","))}e.tenantId&&(o.tid=e.tenantId);const a=o;for(const l of Object.keys(a))void 0===a[l]&&delete a[l];const c=await e._getAppCheckToken(),u=c?`#${Rv}=${encodeURIComponent(c)}`:"";return`${function({config:e}){if(!e.emulator)return`https://${e.authDomain}/${Dv}`;return ng(e,xv)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e)}?${R(a).slice(1)}${u}`}const Pv="webStorageSupport";const Lv=class{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Fy,this._completeRedirectFn=lv,this._overrideRedirectResult=uv}async _openPopup(e,t,n,r){var i;Xm(null===(i=this.eventManagers[e._key()])||void 0===i?void 0:i.manager,"_initialize() not called before _openPopup()");return Nv(e,await Ov(e,t,n,Ym(),r),Uy())}async _openRedirect(e,t,n,r){await this._originValidation(e);return function(e){By().location.href=e}(await Ov(e,t,n,Ym(),r)),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:e,promise:n}=this.eventManagers[t];return e?Promise.resolve(e):(Xm(n,"If manager is not set, promise should be"),n)}const n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n.catch(()=>{delete this.eventManagers[t]}),n}async initAndGetManager(e){const t=await Cv(e),n=new hv(e);return t.register("authEvent",t=>{Qm(null==t?void 0:t.authEvent,e,"invalid-auth-event");return{status:n.onEvent(t.authEvent)?"ACK":"ERROR"}},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Pv,{type:Pv},n=>{var r;const i=null===(r=null==n?void 0:n[0])||void 0===r?void 0:r[Pv];void 0!==i&&t(!!i),$m(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=gv(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Gg()||Vg()||$g()}};var Mv="@firebase/auth",Fv="1.10.8";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Vv{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),(null===(e=this.auth.currentUser)||void 0===e?void 0:e.uid)||null}async getToken(e){if(this.assertAuthConfigured(),await this.auth._initializationPromise,!this.auth.currentUser)return null;return{accessToken:await this.auth.currentUser.getIdToken(e)}}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(t=>{e((null==t?void 0:t.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){Qm(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Uv=h("authIdTokenMaxAge")||300;let jv=null;function Bv(e=nt()){const t=Je(e,"auth");if(t.isInitialized())return t.getImmediate();const n=function(e,t){const n=Je(e,"auth");if(n.isInitialized()){const e=n.getImmediate();if(D(n.getOptions(),null!=t?t:{}))return e;$m(e,"already-initialized")}return n.initialize({options:t})}(e,{popupRedirectResolver:Lv,persistence:[Yy,Ly,Fy]}),r=h("authTokenSyncURL");if(r&&"boolean"==typeof isSecureContext&&isSecureContext){const e=new URL(r,location.origin);if(location.origin===e.origin){const t=(i=e.toString(),async e=>{const t=e&&await e.getIdTokenResult(),n=t&&((new Date).getTime()-Date.parse(t.issuedAtTime))/1e3;if(n&&n>Uv)return;const r=null==t?void 0:t.token;jv!==r&&(jv=r,await fetch(i,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))});!function(e,t,n){V(e).beforeAuthStateChanged(t,n)}(n,t,()=>t(n.currentUser)),function(e,t,n,r){V(e).onIdTokenChanged(t,n,r)}(n,e=>t(e))}}var i;const s=c("auth");return s&&ay(n,`http://${s}`),n}var qv;Zg={loadJS:e=>new Promise((t,n)=>{const r=document.createElement("script");var i,s;r.setAttribute("src",e),r.onload=t,r.onerror=e=>{const t=Km("internal-error");t.customData=e,n(t)},r.type="text/javascript",r.charset="UTF-8",(null!==(s=null===(i=document.getElementsByTagName("head"))||void 0===i?void 0:i[0])&&void 0!==s?s:document).appendChild(r)}),gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="},qv="Browser",Qe(new U("auth",(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:s,authDomain:o}=n.options;Qm(s&&!s.includes(":"),"invalid-api-key",{appName:n.name});const a={apiKey:s,authDomain:o,clientPlatform:qv,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Hg(qv)},c=new Jg(n,r,i,a);return function(e,t){const n=(null==t?void 0:t.persistence)||[],r=(Array.isArray(n)?n:[n]).map(xg);(null==t?void 0:t.errorMap)&&e._updateErrorMap(t.errorMap),e._initializeWithPersistence(r,null==t?void 0:t.popupRedirectResolver)}(c,t),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider("auth-internal").initialize()})),Qe(new U("auth-internal",e=>{const t=Xg(e.getProvider("auth").getImmediate());return new Vv(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),rt(Mv,Fv,function(e){switch(e){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}(qv)),rt(Mv,Fv,"esm2017");export{p as A,jp as B,U as C,rt as D,k as E,A as F,fm as G,Ny as H,xy as I,v as J,S as K,Q as L,et as S,Je as _,Xe as a,Qe as b,C as c,F as d,jf as e,m as f,D as g,pm as h,Bf as i,nt as j,Bv as k,u as l,lm as m,dm as n,Qf as o,V as p,Fm as q,tt as r,I as s,f as t,E as u,Gp as v,Dy as w,mm as x,ce as y,$p as z};
