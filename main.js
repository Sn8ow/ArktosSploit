// Do not copy or next my hack will be undecodable !

var settings = {
    FPS: true,
    ESP: true,
    ESPBox: false,
    traces: false,
    speedHack: 0,
    blink: false,
    invisible: false,
    noCooldown: false,
    megaDamage: false,
    infJump: false,
    infAmmo: false,
    noRecoil: false,
    noSpread: false,
    rapidFire: false,
    noCameraShake: false,
    changeWeapon: false,
};
//window.settings = settings;

var aimbot = {
    enabled: false,
    target: null,
    type: 'Always',
    fire: false,
    focus: false,
    offset: 0,
};

//window.aimbot = aimbot;

var vals = {
    lastPos: false,
};

window.vals = vals;

Object.keys(localStorage).map(key => {
    if (key.startsWith('bs_') && localStorage[key] !== void 0) {
        settings[key.slice(3)] = (["true","false"].includes(localStorage[key]) || !isNaN(Number(localStorage[key]))) ? eval(localStorage[key]) : localStorage[key];
    };
    if (key.startsWith('bsa_') && localStorage[key] !== void 0) {
        aimbot[key.slice(4)] = (["true","false"].includes(localStorage[key]) || !isNaN(Number(localStorage[key]))) ? eval(localStorage[key]) : localStorage[key];
    };
});

function saveLoop() {
    Object.keys(settings).map(key=>key!='blink'&&(localStorage['bs_'+key]=settings[key]));
    Object.keys(aimbot).map(key=>localStorage['bsa_'+key]=aimbot[key]);
    //setTimeout(()=>requestAnimationFrame(saveLoop),1000); // Anti lags
}

var camLookAt = function(entity) {
    if (entity) {
        let t = pc.controls.player.movement.entity.getPosition(),
            e = Utils.lookAt(entity.position.x, entity.position.z, t.x, t.z);
        pc.controls.player.movement.lookX = e * 57.29577951308232 + Math.random()/10 - Math.random()/10;
        pc.controls.player.movement.lookY = -1 * (getXDire(entity.position.x, entity.position.y, entity.position.z, t.x, t.y+0.9, t.z)) * 57.29577951308232;
    };
};

//window.camLookAt = camLookAt;

var getD3D = function(a, b, c, d, e, f) {
    let g = a - d, h = b - e, i = c - f;
    return Math.sqrt(g * g + h * h + i * i);
};
var getXDire = function(a, b, c, d, e, f) {
    let g = Math.abs(b - e), h = getD3D(a, b, c, d, e, f);
    return Math.asin(g / h) * (b > e ? -1 : 1);
};

function renderBox(x=0,y=0,z=0,w=1,h=5,c=new pc.Color(1, 1, 1)) {
    var a,b;

    a = new pc.Vec3(x-w,y, z-w)
    b = new pc.Vec3(x-w, y+h, z-w)
    pc.Application.getApplication().renderLine(a,b,c);
    a = new pc.Vec3(x+w, y, z+w)
    b = new pc.Vec3(x+w, y+h, z+w)
    pc.Application.getApplication().renderLine(a,b,c);
    a = new pc.Vec3(x-w, y, z+w)
    b = new pc.Vec3(x-w, y+h, z+w)
    pc.Application.getApplication().renderLine(a,b,c);
    a = new pc.Vec3(x+w, y, z-w)
    b = new pc.Vec3(x+w, y+h, z-w)
    pc.Application.getApplication().renderLine(a,b,c);

    a = new pc.Vec3(x+w, y+h, z+w)
    b = new pc.Vec3(x-w, y+h, z+w)
    pc.Application.getApplication().renderLine(a,b,c);
    a = new pc.Vec3(x+w, y+h, z-w)
    b = new pc.Vec3(x+w, y+h, z+w)
    pc.Application.getApplication().renderLine(a,b,c);
    a = new pc.Vec3(x-w, y+h, z-w)
    b = new pc.Vec3(x+w, y+h, z-w)
    pc.Application.getApplication().renderLine(a,b,c);
    a = new pc.Vec3(x-w, y+h, z-w)
    b = new pc.Vec3(x-w, y+h, z+w)
    pc.Application.getApplication().renderLine(a,b,c);

    a = new pc.Vec3(x+w, y, z+w)
    b = new pc.Vec3(x-w, y, z+w)
    pc.Application.getApplication().renderLine(a,b,c);
    a = new pc.Vec3(x+w, y, z-w)
    b = new pc.Vec3(x+w, y, z+w)
    pc.Application.getApplication().renderLine(a,b,c);
    a = new pc.Vec3(x-w, y, z-w)
    b = new pc.Vec3(x+w, y, z-w)
    pc.Application.getApplication().renderLine(a,b,c);
    a = new pc.Vec3(x-w, y, z-w)
    b = new pc.Vec3(x-w, y, z+w)
    pc.Application.getApplication().renderLine(a,b,c);
};

function createGui() {
    var gui = new guify({
        title: 'BlockSploit',
        align: 'right',
        theme: 'dark',
        opacity: 0.95,
        barMode: "none",
        open: true
    });
    // Aimbot
    gui.Register({
        type: 'folder',
        label: 'Aimbot',
        open: true
    });
    gui.Register({
        type: 'checkbox',
        label: 'Enabled',
        object: aimbot,
        property: 'enabled',
    },{folder: 'Aimbot'});
    gui.Register({
        type: 'select',
        label: 'Type',
        object: aimbot,
        property: 'type',
        options: ['Always', 'Fire', 'Focus'],
    },{folder: 'Aimbot'});
    gui.Register({
        type: 'checkbox',
        label: 'Fire',
        object: aimbot,
        property: 'fire',
    },{folder: 'Aimbot'});
    gui.Register({
        type: 'checkbox',
        label: 'Focus',
        object: aimbot,
        property: 'focus',
    },{folder: 'Aimbot'});
    gui.Register({
        type: 'range',
        label: 'Offset',
        object: aimbot,
        property: 'offset',
        min: 0, max: 10, step: 1,
    },{folder: 'Aimbot'});
    // Player
    gui.Register({
        type: 'folder',
        label: 'Player',
        open: true
    });
    gui.Register({
        type: 'range',
        label: 'Speed Hack',
        object: settings,
        property: 'speedHack',
        min: 0, max: 5, step: 1,
    },{folder: 'Player'});
    gui.Register({
        type: 'checkbox',
        label: 'Inf Jump',
        object: settings,
        property: 'infJump',
    },{folder: 'Player'});
    gui.Register({
        type: 'checkbox',
        label: 'Blink [B]',
        object: settings,
        property: 'blink',
    },{folder: 'Player'});
    gui.Register({
        type: 'checkbox',
        label: 'Invisible',
        object: settings,
        property: 'invisible',
    },{folder: 'Player'});
    gui.Register({
        type: 'checkbox',
        label: 'No Cooldown',
        object: settings,
        property: 'noCooldown',
    },{folder: 'Player'});
    // Misc
    gui.Register({
        type: 'folder',
        label: 'Misc',
        open: true
    });
    gui.Register({
        type: 'checkbox',
        label: 'ESP',
        object: settings,
        property: 'ESP',
    },{folder: 'Misc'});
    gui.Register({
        type: 'checkbox',
        label: 'FPS',
        object: settings,
        property: 'FPS',
    },{folder: 'Misc'});
    gui.Register({
        type: 'checkbox',
        label: 'ESP Box',
        object: settings,
        property: 'ESPBox',
    },{folder: 'Misc'});
    gui.Register({
        type: 'checkbox',
        label: 'Traces',
        object: settings,
        property: 'traces',
    },{folder: 'Misc'});
    // Weapon
    gui.Register({
        type: 'folder',
        label: 'Weapon',
        open: true
    });
    gui.Register({
        type: 'checkbox',
        label: 'Mega Damage',
        object: settings,
        property: 'megaDamage',
    },{folder: 'Weapon'});
    gui.Register({
        type: 'checkbox',
        label: 'Inf Ammo',
        object: settings,
        property: 'infAmmo',
    },{folder: 'Weapon'});
    gui.Register({
        type: 'checkbox',
        label: 'No Recoil',
        object: settings,
        property: 'noRecoil',
    },{folder: 'Weapon'});
    gui.Register({
        type: 'checkbox',
        label: 'No Spread',
        object: settings,
        property: 'noSpread',
    },{folder: 'Weapon'});
    gui.Register({
        type: 'checkbox',
        label: 'Rapid Fire',
        object: settings,
        property: 'rapidFire',
    },{folder: 'Weapon'});
    gui.Register({
        type: 'checkbox',
        label: 'No Camera Shake',
        object: settings,
        property: 'noCameraShake',
    },{folder: 'Weapon'});
    gui.Register({
        type: 'checkbox',
        label: 'No Change Cooldown',
        object: settings,
        property: 'changeWeapon',
    },{folder: 'Weapon'});
    // End
    gui.Register({
        type: 'title',
        label: 'Created by Blockman_#0431'
    });
    return gui;
};

var GUI = createGui();
//window.gui = GUI;
GUI.Toast('Join our Discord: discord.gg/hRpPrN3');

// FPS counter
var stats = new Stats();
document.body.appendChild(stats.dom);
function updateFPS() {
    stats.update();
    stats.dom.style.display = settings.FPS ? "" : "none";
    //requestAnimationFrame(loop);
}


(function setupKeys() {
    document.addEventListener('keydown', e => {
        if ("INPUT" === document.activeElement.tagName) return;
        switch(e.key.toLowerCase()) {
            case 'b':
                settings.blink = !settings.blink;
                break;
            default:
                break;
        };
    });
})();


var made = {
    ads: !1,
    patch: !1
};
var hooks;
requestAnimationFrame(function pre() {
    if (typeof PokiSDK === 'object') {
        delete PokiSDK;
        made.ads = !0;
    };
    if (typeof AdsManager === 'function') {
        hooks = patchCode();
        made.patch = !0;
    };
    if (made.ads && made.patch) {
        delete made;
        delete pre;
        return;
    };
    requestAnimationFrame(pre);
});

function patchCode() {
    let hooks = {
        network: null,
        movement: null,
        player: null,
    };
    try {
        const movinit = Movement.prototype.initialize;
        const netinit = NetworkManager.prototype.initialize;
        const plrinit = Player.prototype.initialize;
        Movement.prototype.initialize = function() {
            hooks.movement = this;
            return movinit.apply(this,arguments);
        };
        NetworkManager.prototype.initialize = function() {
            hooks.network = this;
            return netinit.apply(this,arguments);
        };
        Player.prototype.initialize = function() {
            hooks.player = this;
            return plrinit.apply(this,arguments);
        };
        VengeGuard.prototype.onCheck=_=>pc.app.fire("Network:Guard",!0);

        Player.prototype.setPosition = function() {
            //if (this.currentDate - this.lastPositionUpdate < 30) return !1;
            var t = this.entity.getPosition().clone()
            if (settings.invisible) t.y += (pc.controls.player.movement.leftMouse ? 0 : 1000);
            var e = this.movement.lookX % 360
            , a = this.movement.lookY % 360;
            if (!settings.blink && vals.lastPos) vals.lastPos = null;
            else if (settings.blink && !vals.lastPos) vals.lastPos = [t.x, t.y, t.z, e, a];
            if (settings.blink && vals.lastPos) {
                this.app.fire("Network:Position", vals.lastPos[0], vals.lastPos[1], vals.lastPos[2], vals.lastPos[3], vals.lastPos[4]);
                renderBox(vals.lastPos[0],vals.lastPos[1]-2.5,vals.lastPos[2],1,5,new pc.Color(0,0,1));
                pc.Application.getApplication().renderLine(new pc.Vec3(vals.lastPos[0], vals.lastPos[1], vals.lastPos[2]),new pc.Vec3(t.x,t.y,t.z),new pc.Color(0,0,1));
            } else {
                this.app.fire("Network:Position", t.x, t.y, t.z, e, a);
            };
            this.lastPositionUpdate = this.currentDate;
        };

        Enemy.prototype.damage=function(t,i,e){var a,r,s,n=!1;e&&.9<e.y&&(n=!0),this.damageAngle=Utils.lookAt(0,0,e.x,e.z),this.skinMaterial&&(this.skinMaterial.emissiveIntensity=.65,this.skinMaterial.update()),this.tempAngle.x+=3*Math.random()-3*Math.random(),this.tempAngle.y+=2*Math.random()-2*Math.random(),this.isActivated||(clearTimeout(this.skinMaterialTimer),this.skinMaterialTimer=setTimeout(function(i){var t=pc.app.tween(i.skinMaterial).to({emissiveIntensity:0},.15,pc.Linear);t.on("update",function(t){i.skinMaterial.update()}),t.start()},50,this),a=Math.round(2*Math.random())+1,r=this.skin+"-Grunt-"+a,s=!0,"TDM"!=pc.currentMode&&"PAYLOAD"!=pc.currentMode||pc.currentTeam==this.team&&(s=!1,this.app.fire("Overlay:FriendlyFire",!0)),s&&(this.app.fire("Hit:Point",this.entity,Math.floor(20*Math.random())+5),this.entity.sound.play(r),n&&this.app.fire("Hit:Headshot",this.entity,Math.floor(20*Math.random())+5)),this.lastDamage=Date.now(),"TDM"!=pc.currentMode&&"PAYLOAD"!=pc.currentMode||this.app.fire("Outline:Add",this.characterEntity)),settings.megaDamage?(this.app.fire("Network:Damage",t,99.99999,n,this.playerId),this.app.fire("Network:Damage",t,99.99999,n,this.playerId)):this.app.fire("Network:Damage",t,i,n,this.playerId)};
        Label.prototype.update=function(e){if(!this.isInitalized)return!1;if(!this.isEnabled)return this.labelEntity&&(this.labelEntity.enabled=!1),!1;if(!pc.isSpectator&&!settings.ESP){if(this.player.isDeath)return this.labelEntity.enabled=!1;if(1500<Date.now()-this.player.lastDamage){if(pc.currentTeam!=this.team||"PAYLOAD"!=pc.currentMode&&"TDM"!=pc.currentMode)return this.labelEntity.enabled=!1;this.labelEntity.enabled=!0}}this.updateTeamColor();var t=new pc.Vec3,i=this.currentCamera,a=this.app.graphicsDevice.maxPixelRatio,s=this.screenEntity.screen.scale,n=this.app.graphicsDevice;i.worldToScreen(this.headPoint.getPosition(),t),t.x*=a,t.y*=a,0<t.x&&t.x<this.app.graphicsDevice.width&&0<t.y&&t.y<this.app.graphicsDevice.height&&0<t.z?(this.labelEntity.setLocalPosition(t.x/s,(n.height-t.y)/s,0),this.labelEntity.enabled=!0):this.labelEntity.enabled=!1};
        Movement.prototype.triggerKeyF=function(){if(!settings.noCooldown)return this.now()-this.lastThrowDate<1e3*this.playerAbilities.throwCooldown?(this.entity.sound.play("Error"),!1):!(this.isReloading>this.timestamp)&&!(this.playerAbilities.isHitting>this.timestamp)&&(this.isFocusing=!1,this.player.throw(),this.stopFiring(),this.playerAbilities.triggerKeyF(),void(this.lastThrowDate=this.now()));this.player.throw(),this.playerAbilities.triggerKeyF()};
        Movement.prototype.setMovement=function(){if(this.player.isDeath)return!1;if(pc.isFinished)return!1;if(this.isDashing)return!1;var i=this.angleEntity.forward,t=this.angleEntity.right,s=1;this.isFocusing&&(s=this.focusSpeedFactor),s*=this.animation.movementFactor,s*=settings.speedHack+1,this.force.x=0,this.force.z=0,!this.isForward||this.isLeft||this.isRight?this.isForward&&(this.force.x+=i.x*this.strafingSpeed*s,this.force.z+=i.z*this.strafingSpeed*s):(this.force.x+=i.x*this.defaultSpeed*s,this.force.z+=i.z*this.defaultSpeed*s),this.isBackward&&(this.force.x-=i.x*this.strafingSpeed*s,this.force.z-=i.z*this.strafingSpeed*s),this.isLeft&&(this.force.x-=t.x*this.strafingSpeed*s,this.force.z-=t.z*this.strafingSpeed*s),this.isRight&&(this.force.x+=t.x*this.strafingSpeed*s,this.force.z+=t.z*this.strafingSpeed*s),this.entity.rigidbody.applyForce(this.currentForce)};
        Movement.prototype.jump=function(){return!!(settings.infJump||this.isLanded||this.isCollided)&&(!(!settings.infJump&&this.isDashing)&&(!(!settings.infJump&&this.bounceJumpTime>this.timestamp)&&(this.jumpingTime=this.timestamp+this.jumpDuration,this.isJumping=!0,this.isLanded=!1,this.airTime=this.now(),this.randomDirection=.5<Math.random()?-1:1,this.previousVelocity,3e3<this.now()-this.lastImpactTime&&(t="Jump-"+(Math.round(+Math.random())+1),this.app.fire("Character:Sound",t,.1*Math.random()),this.entity.sound.play("Only-Jump"),this.entity.sound.slots["Only-Jump"].pitch=.1*Math.random()+1.1),this.dynamicGravity=0,this.app.fire("Overlay:Jump",!0),this.player.fireNetworkEvent("j"),!(this.isShooting>this.timestamp)&&void this.app.tween(this.animation).to({jumpAngle:-11},.15,pc.BackOut).start())));var t};
        Movement.prototype.setShooting=function(t){if(!this.isMouseLocked)return!1;if(!this.currentWeapon.isShootable&&!settings.rapidFire)return!1;if(this.leftMouse||this.isShootingLocked||this.isFireStopped||(this.stopFiring(),0===this.currentWeapon.ammo&&this.reload()),this.leftMouse&&!this.isShootingLocked&&(settings.infAmmo||0<this.currentWeapon.ammo?this.isShooting=(settings.rapidFire?1e-7:this.currentWeapon.shootTime)+this.timestamp:this.reload()),this.player.checkShooting(),this.isShooting>this.timestamp&&!this.isShootingLocked){settings.infAmmo&&this.setAmmoFull();var i=settings.noRecoil?0:this.currentWeapon.recoil,e=settings.noCameraShake?0:this.currentWeapon.cameraShake,a=.03*Math.random()-.03*Math.random(),n=-.15*i,s=6*i,o=-1.2,r=2,h=settings.noSpread?0:this.currentWeapon.spread,p=Math.cos(110*this.spreadCount),c=settings.noSpread?0:this.currentWeapon.spread*p;this.cancelInspect(!0),this.setShootDirection(),this.isFocusing&&"Rifle"==this.currentWeapon.type&&(n=-.05,o=-.2,e*=s=.5,r=.05,h=settings.noSpread?0:this.currentWeapon.focusSpread,c=settings.noSpread?0:this.currentWeapon.focusSpread*p),"Sniper"!=this.currentWeapon.type&&"Shotgun"!=this.currentWeapon.type||(this.spreadNumber=settings.noSpread?0:this.currentWeapon.spread,this.isFocusing&&(this.spreadNumber=settings.noSpread?0:this.currentWeapon.focusSpread),o=-5,r=5.2),this.currentWeapon.shoot();var m=this.currentWeapon.bulletPoint.getPosition().clone(),u=this.currentWeapon.bulletPoint.getEulerAngles().clone();"Sniper"==this.currentWeapon.type&&this.isFocusing||(this.app.fire("EffectManager:Bullet",m,u),this.entity.script.weaponManager.triggerShooting());var d=this.currentWeapon.muzzlePoint.getPosition().clone(),l=this.raycastShootFrom,g=Math.random()*this.spreadNumber-Math.random()*this.spreadNumber,S=Math.random()*this.spreadNumber-Math.random()*this.spreadNumber,f=Math.random()*this.spreadNumber-Math.random()*this.spreadNumber,b=this.raycastTo.clone().add(new pc.Vec3(g,S,f)),M=this.currentWeapon.damage,W=this.currentWeapon.distanceMultiplier;if("Shotgun"==this.currentWeapon.type){this.app.fire("EffectManager:Fire",l,b,d,this.player.playerId,M,"Shotgun",W);for(var y=0;y<6;y++)g=Math.cos(y/3*Math.PI)*this.spreadNumber,S=Math.sin(y/3*Math.PI)*this.spreadNumber,f=Math.cos(y/3*Math.PI)*this.spreadNumber,b=this.raycastTo.clone().add(new pc.Vec3(g,S,f)),this.app.fire("EffectManager:Fire",l,b,d,this.player.playerId,M,"Shotgun",W)}else this.app.fire("EffectManager:Fire",l,b,d,this.player.playerId,M);this.lookY+=.04*e,this.spreadNumber=pc.math.lerp(this.spreadNumber,h,.4),this.spreadCount+=t,this.currentWeapon.ammo--,this.app.fire("Overlay:Shoot",!0),this.app.tween(this.animation).to({bounceX:a,bounceZ:n,bounceAngle:s,shootSwing:r},.03,pc.BackOut).start(),this.app.tween(this.animation).to({cameraShootBounce:o,cameraBounce:this.animation.cameraBounce+.025*e},.09,pc.BackOut).start(),this.animation.activeBounce=pc.math.lerp(this.animation.activeBounce,-e,.05),this.animation.horizantalSpread=pc.math.lerp(this.animation.horizantalSpread,.04*c,.1),this.isShootingLocked=!0,this.isFireStopped=!1}this.isShooting<this.timestamp&&this.isShootingLocked&&(this.isShootingLocked=!1),this.isShooting>this.timestamp+.1&&(this.animation.jumpAngle=pc.math.lerp(this.animation.jumpAngle,0,.2)),this.animation.fov=pc.math.lerp(this.animation.fov,0,.1),this.animation.bounceX=pc.math.lerp(this.animation.bounceX,0,.3),this.animation.bounceZ=pc.math.lerp(this.animation.bounceZ,0,.1),this.animation.bounceAngle=pc.math.lerp(this.animation.bounceAngle,0,.2),this.animation.shootSwing=pc.math.lerp(this.animation.shootSwing,0,.01),this.animation.activeBounce=pc.math.lerp(this.animation.activeBounce,0,.1),this.animation.cameraShootBounce=pc.math.lerp(this.animation.cameraShootBounce,0,.1),this.animation.cameraBounce=pc.math.lerp(this.animation.cameraBounce,0,.1),this.animation.cameraImpact=pc.math.lerp(this.animation.cameraImpact,0,.1),this.spreadNumber=pc.math.lerp(this.spreadNumber,0,.2),this.animation.horizantalSpread=pc.math.lerp(this.animation.horizantalSpread,0,.01)};
    } catch(e) {};
    console.log('Code Patched!');
    window.hooks = hooks;
    return hooks;
};

requestAnimationFrame(function mainLoop() {
    window.target = aimbot.target;
    requestAnimationFrame(saveLoop);
    requestAnimationFrame(updateFPS);
    (function() {
        try {
            settings.changeWeapon&&(hooks.player.lastWeaponChange = 0);
            if (hooks.network) {
                hooks.network.players.forEach(t => {
                    if (-1 !== t.script.enemy.playerId && !t.script.enemy.isDeath) {
                        let e = pc.controls.player.entity.getPosition();
                        let o = t.getPosition();
                        let c = t.script.enemy.team == hooks.network.team && "none" !== t.script.enemy.team ? new pc.Color(0, 1, 0) : new pc.Color(1, 0, 0);
                        if (settings.traces) {
                            pc.Application.getApplication().renderLine(new pc.Vec3(e.x, e.y, e.z), new pc.Vec3(o.x, o.y, o.z),c);
                        };
                        if (settings.ESPBox) {
                            renderBox(o.x,o.y-2.5,o.z,1,5,c)
                        };
                    }
                })
            }
            if (hooks.network) {
                var ld = Infinity;
                hooks.network.players.forEach(t => {
                    if ((t.script.enemy.team != hooks.network.team || "none" == hooks.network.team) && "Death" != t.script.enemy.currentAnimation && "none" != t.script.enemy.currentAnimation) {
                        let e = pc.controls.player.movement.entity.getPosition();
                        let o = Math.sqrt(Math.pow(t.position.y - e.y, 2) + Math.pow(t.position.x - e.x, 2) + Math.pow(t.position.z - e.z, 2));
                        if (o < ld){
                            ld = o;
                            aimbot.target = t;
                        }
                    }
                })
                if (aimbot.enabled && aimbot.target) {
                    let t = pc.app.systems.rigidbody.raycastAll(pc.controls.player.movement.entity.getPosition(), aimbot.target.getPosition()).map(t => t.entity.tags._list.toString());
                    if ((1 === t.length && "Player" === t[0]) && ('Always' == aimbot.type || ('Focus' == aimbot.type && pc.controls.player.movement.isFocusing) || ('Fire' == aimbot.type && pc.controls.player.movement.leftMouse)) && aimbot.target) {
                        aimbot.target.position.y = (aimbot.target.position.y - 2) + (aimbot.offset / 3);
                        camLookAt(aimbot.target);
                        aimbot.focus && (pc.controls.player.movement.isFocusing = !0);
                        aimbot.fire && (pc.controls.player.movement.leftMouse = !0);
                    } else {
                        aimbot.focus && (pc.controls.player.movement.isFocusing = !1);
                        aimbot.fire && (pc.controls.player.movement.leftMouse = !1);
                    }
                }
            }
        } catch(e) {};
    })();
    requestAnimationFrame(mainLoop);
});
