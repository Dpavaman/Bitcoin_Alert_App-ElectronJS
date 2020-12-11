const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const axios = require('axios');
const ipc = electron.ipcRenderer;

const notifyBtn = document.getElementById('notifyBtn')
var price = document.querySelector('h1');
var targetPrice = document.getElementById('targetPrice');
var targetPriceVal;

const notification = {
    title : "Bitcoin Rise Alert",
    body : `Bitcoin has Juset Beat your target Price!`
}

function getBTC(){
    axios.get('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=INR,USD,EUR').then(res=>{
        const cryptos = res.data.USD;
        price.innerHTML = `$ ${cryptos.toLocaleString('en')}`;

        if(targetPrice.innerHTML !== '' && targetPriceVal < res.data.USD){
            const myNotification = new window.Notification(notification.title, notification);
        }
    });
}
getBTC();
setInterval(getBTC, 30000);

notifyBtn.addEventListener('click', function(event){
    const modalPath = path.join('file://',__dirname, 'add.html');
    let win = new BrowserWindow({
        resizable: false,
        transparent: true,
        alwaysOnTop: true,
        width: 400,
        height: 200,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        },
    });
    
    win.on('close', ()=>{
        win = null;
    });
    win.loadURL(modalPath);
    win.show();
});

ipc.on('targetPriceVal', (event, arg)=>{
     targetPriceVal = Number(arg);
    targetPrice.innerHTML = `Notify Me when The Bitcoin Rises more Than : $ ${targetPriceVal.toLocaleString('en')}`;
} )