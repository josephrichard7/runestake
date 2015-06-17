'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.factory(ApplicationConfiguration.factories.stakegambler, [
	function() {

		var SPRITE_LEFT = {
			ATTACK: {
				name: 		'gamblerLeftAttack',
				img: 		'/modules/gamblermain/img/sprites/leftgambler/attack.png',
				X: 			240,
				Y: 			160,
				maxFrame: 	6
			},
			STANDBY: {
				name: 		'gamblerLeftStandby',
				img: 		'/modules/gamblermain/img/sprites/leftgambler/standby.png',
				X: 			240,
				Y: 			160,
				maxFrame: 	2
			},
			DYING: {
				name: 		'gamblerLeftDying',
				img: 		'/modules/gamblermain/img/sprites/leftgambler/dying.png',
				X: 			240,
				Y: 			160,
				maxFrame: 	7
			},
			POSITION_SPRITE: {
				X: 180,
				Y: 150
			},
			POSITION_HEALTHBAR: {
				X: 240,
				Y: 145
			},
			POSITION_HITTEXT: {
				X: 240,
				Y: 180
			},
			POSITION_YELLOWARROW: {
				X: 265,
				Y: 100
			},
			POSITION_COUNTDOWNTEXT: {
				X: 270,
				Y: 143
			}
		};

		var SPRITE_RIGHT = {
			ATTACK: {
				name: 		'gamblerRightAttack',
				img: 		'/modules/gamblermain/img/sprites/rightgambler/attack.png',
				X: 			240,
				Y: 			160,
				maxFrame: 	6
			},
			STANDBY: {
				name: 		'gamblerRightStandby',
				img: 		'/modules/gamblermain/img/sprites/rightgambler/standby.png',
				X: 			240,
				Y: 			160,
				maxFrame: 	2
			},
			DYING: {
				name: 		'gamblerRightDying',
				img: 		'/modules/gamblermain/img/sprites/rightgambler/dying.png',
				X: 			240,
				Y: 			160,
				maxFrame: 	7
			},
			POSITION_SPRITE: {
				X: 280,
				Y: 150
			},
			POSITION_HEALTHBAR: {
				X: 340,
				Y: 145
			},
			POSITION_HITTEXT: {
				X: 340,
				Y: 180
			},
			POSITION_YELLOWARROW: {
				X: 365,
				Y: 100
			},
			POSITION_COUNTDOWNTEXT: {
				X: 370,
				Y: 143
			}
		};

	    var HEALTH_SIZEX 		= 60;
	    var HEALTH_SIZEY 		= 10;

		function Gambler(game, position, iam){
			this.game 			= game;
			this.position 		= position;
			this.health 		= 80;
			this.iam 			= iam;

			this.graphicHealth 		= {};
			this.graphicYellowArrow = {};
			this.hitText 			= {};
			this.countDownText 		= {};
			this.spriteAttack		= {};
		    this.spriteStandby		= {};
		    this.spriteDying		= {};
			this.animAttack			= {};
			this.animStandby		= {};
			this.animDying			= {};

			this.SPRITE_CONF = this.position === 'LEFT'? SPRITE_LEFT : SPRITE_RIGHT;

			this.fnPreLoad();
		}

		Gambler.prototype.fnAddSpriteToGame = function(sprite){
			var spriteAdded = this.game.add.sprite(
				this.SPRITE_CONF.POSITION_SPRITE.X, 
				this.SPRITE_CONF.POSITION_SPRITE.Y, 
				sprite.name
			);
			
			// Scale according to desired size 
			spriteAdded.scale.setTo(0.8, 0.8);

			// Hide by default
			spriteAdded.visible 	= false;

			return spriteAdded;
		};

		Gambler.prototype.fnAttack = function(){
			this.fnStopStandby();
			this.spriteAttack.visible = true;
			this.animAttack.play(10, false);
		};

		Gambler.prototype.fnCreate = function(){
			this.fnDrawSprites();
			this.fnDrawHit();
			this.fnDrawCountDown();

		    if(!this.iam){
		    	this.fnDrawYellowArrow();
		    }
		};

		Gambler.prototype.fnDrawHealthBar = function(){
			this.graphicHealth 				= this.game.add.graphics(0, 0);
			this.graphicHealthBackground 	= this.game.add.graphics(0, 0);

			this.graphicHealth.beginFill(0x1EFF00);
			this.graphicHealthBackground.beginFill(0xFF0000);

			this.graphicHealthBackground.drawRect(
				this.SPRITE_CONF.POSITION_HEALTHBAR.X,
				this.SPRITE_CONF.POSITION_HEALTHBAR.Y,
				HEALTH_SIZEX,
				HEALTH_SIZEY
			);

			this.game.world.bringToTop(this.graphicHealth);
			this.graphicHealth.drawRect(
				this.SPRITE_CONF.POSITION_HEALTHBAR.X,
				this.SPRITE_CONF.POSITION_HEALTHBAR.Y,
				HEALTH_SIZEX,
				HEALTH_SIZEY
			);
		};

		Gambler.prototype.fnDrawHit = function(){
			var style = { 
				font: '32px Arial',
				fill: '#ff0044',
				// , wordWrap: true
				// , wordWrapWidth: sprite.width
				align: 'center' 
			};
			this.hitText = this.game.add.text(
				this.SPRITE_CONF.POSITION_HITTEXT.X, 
				this.SPRITE_CONF.POSITION_HITTEXT.Y, 
				'0',
				style
			);
			this.game.world.bringToTop(this.hitText);
			this.hitText.visible = false;
		};

		Gambler.prototype.fnDrawCountDown = function(){
			var style = { 
				font: '12px Arial',
				fill: '#FCFF00',
				// , wordWrap: true
				// , wordWrapWidth: sprite.width
				align: 'center'
			};
			this.countDownText = this.game.add.text(
				this.SPRITE_CONF.POSITION_COUNTDOWNTEXT.X,
				this.SPRITE_CONF.POSITION_COUNTDOWNTEXT.Y,
				'0',
				style
			);
			this.game.world.bringToTop(this.countDownText);
			this.countDownText.visible = false;
		};

		Gambler.prototype.fnDrawSprites = function(){
			var _this = this;
			// Configure attack sprite
			this.spriteAttack 	= this.fnAddSpriteToGame(
				this.SPRITE_CONF.ATTACK,
				this.SPRITE_CONF.POSITION_SPRITE.X,
				this.SPRITE_CONF.POSITION_SPRITE.Y
			);
			// Scale according to desired size 
			// this.spriteAttack.scale.setTo(1.8, 1.8);
			// Add animation to attack
		    this.animAttack 	= this.spriteAttack.animations.add('attack');
		    this.animAttack.onComplete.add(function(){
		        _this.spriteAttack.visible = false;
		        if(this.health > 0){
		        	_this.fnStartStandby();	
		        }
		    }, this);

		    // Configure standby sprite
			this.spriteStandby 	= this.fnAddSpriteToGame(
				this.SPRITE_CONF.STANDBY,
				this.SPRITE_CONF.POSITION_SPRITE.X,
				this.SPRITE_CONF.POSITION_SPRITE.Y
			);
			// standby.scale.setTo(2, 2);
		    this.animStandby 	= this.spriteStandby.animations.add('standby');		    

		    // Configure dying sprite
			this.spriteDying 	= this.fnAddSpriteToGame(
				this.SPRITE_CONF.DYING,
				this.SPRITE_CONF.POSITION_SPRITE.X,
				this.SPRITE_CONF.POSITION_SPRITE.Y
			);
			this.animDying 		= this.spriteDying.animations.add('dying');
		};

		Gambler.prototype.fnDrawYellowArrow = function(){
			var x;
			var y;

			this.graphicYellowArrow = this.game.add.graphics(0, 0);
			this.graphicYellowArrow.lineStyle(3, 0xFCFF00);

			x = this.SPRITE_CONF.POSITION_YELLOWARROW.X;
			y = this.SPRITE_CONF.POSITION_YELLOWARROW.Y;

			this.graphicYellowArrow.moveTo(x, y);

			x += 15;
			this.graphicYellowArrow.lineTo(x, y);
			y += 20;
			this.graphicYellowArrow.lineTo(x, y);
			x += 10;
			this.graphicYellowArrow.lineTo(x, y);
			x -= 17.5;
			y += 20;
			this.graphicYellowArrow.lineTo(x, y);
			x -= 17.5;
			y -= 20;
			this.graphicYellowArrow.lineTo(x, y);
			x += 10;
			this.graphicYellowArrow.lineTo(x, y);
			y -= 20;
			this.graphicYellowArrow.lineTo(x, y);

			this.game.world.bringToTop(this.graphicYellowArrow);
		};

		Gambler.prototype.fnDying = function(){
			this.fnStopStandby();
			this.spriteDying.visible = true;
			this.animDying.play(10, false);	
		};
		
		Gambler.prototype.fnPreLoad = function(){
			this.fnPreLoadSprite(this.SPRITE_CONF.ATTACK);
		    this.fnPreLoadSprite(this.SPRITE_CONF.STANDBY);
		    this.fnPreLoadSprite(this.SPRITE_CONF.DYING);
		};	

		Gambler.prototype.fnPreLoadSprite = function(sprite){
			this.game.load.spritesheet(sprite.name, sprite.img, sprite.X, sprite.Y, sprite.maxFrame);
		};

		Gambler.prototype.fnStartStandby = function(){
			this.spriteStandby.visible = true;
			this.animStandby.play(2, true);
		};

		Gambler.prototype.fnStartCountDown = function(){
			var _this = this;

			setTimeout(function(){
				_this.countDownText.setText('3');
				_this.countDownText.visible = true;
			}, 1000);
			setTimeout(function(){
				_this.countDownText.setText('2');
			}, 3000);
			setTimeout(function(){
				_this.countDownText.setText('1');
			}, 5000);
			setTimeout(function(){
				_this.fnDrawHealthBar();
				_this.game.world.bringToTop(_this.countDownText);
				_this.countDownText.x -= 20; 
				_this.countDownText.setText('FIGHT!');
			}, 7000);
			setTimeout(function(){
				_this.countDownText.visible = false;
			}, 9000);
		};

		Gambler.prototype.fnStopStandby = function(){
		    this.spriteStandby.visible = false;
			this.animStandby.stop(true);
		};

		Gambler.prototype.fnUpdateHealthBar = function(health){
			this.health = health;
			this.graphicHealth.clear();
			this.graphicHealth.drawRect(
				this.SPRITE_CONF.POSITION_HEALTHBAR.X,
				this.SPRITE_CONF.POSITION_HEALTHBAR.Y,
				(HEALTH_SIZEX * this.health) / 99, 
				HEALTH_SIZEY
			);
		};

		Gambler.prototype.fnUpdateHitText = function(amountHitReceived){
			var _this = this;
			if(amountHitReceived >= 0){
				this.hitText.setText(amountHitReceived.toString());
				this.hitText.visible = true;
				setTimeout(function(){
					_this.hitText.visible = false;
				}, 1000);
			}
		};

		return Gambler;
	}
]);