'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.factory(ApplicationConfiguration.factories.gamblergame, [
	function() {

		var SPRITE_RIGHT = {
			ATTACK: {
				name: 		'gamblerRightAttack',
				img: 		'/modules/gamblermain/img/sprites/attack.png',
				X: 			240,
				Y: 			160,
				maxFrame: 	6
			},
			STANDBY: {
				name: 		'gamblerRightStandby',
				img: 		'/modules/gamblermain/img/sprites/standby.png',
				X: 			240,
				Y: 			160,
				maxFrame: 	2
			},
			DYING: {
				name: 		'gamblerRightDying',
				img: 		'/modules/gamblermain/img/sprites/dying.png',
				X: 			240,
				Y: 			160,
				maxFrame: 	7
			}
		};

		var SPRITE_LEFT = {
			ATTACK: {
				name: 		'gamblerLeftAttack',
				img: 		'/modules/gamblermain/img/sprites/attack.png',
				X: 			240,
				Y: 			160,
				maxFrame: 	6
			},
			STANDBY: {
				name: 		'gamblerLeftStandby',
				img: 		'/modules/gamblermain/img/sprites/standby.png',
				X: 			240,
				Y: 			160,
				maxFrame: 	2
			},
			DYING: {
				name: 		'gamblerLeftDying',
				img: 		'/modules/gamblermain/img/sprites/dying.png',
				X: 			240,
				Y: 			160,
				maxFrame: 	7
			}
		};

	    var HEALTH_SIZEX 		= 60;
	    var HEALTH_SIZEY 		= 10;

		function Gambler(game, position){
			this.game 			= game;
			this.position 		= position;
			this.health 		= 80;
			this.iam 			= false;

			this.graphicHealth 	= {};
			this.spriteAttack	= {};
		    this.spriteStandby	= {};
		    this.spriteDying	= {};
			this.animAttack		= {};
			this.animStandby	= {};
			this.animDying		= {};

			this.fnPreLoad();
		}

		Gambler.prototype.fnAddSpriteToGame = function(sprite, positionX, positionY){
			var spriteAdded = this.game.add.sprite(positionX, positionY, sprite.name);
			
			// Scale according to desired size 
			spriteAdded.scale.setTo(0.8, 0.8);

			// Hide by default
			spriteAdded.visible 	= false;

			return spriteAdded;
		};

		Gambler.prototype.fnAttack = function(hitAmount){
			this.fnStopStandby();
			this.spriteAttack.visible = true;
			this.animAttack.play(10, false);

			this.fnDrawHit();
		};

		Gambler.prototype.fnCreate = function(){
			var sprite 		= {};
			var positionX	= 0;
			var positionY	= 0;
		    var healthX 	= 0;
		    var healthY		= 0;

			if(this.position === 'LEFT'){
				sprite 		= SPRITE_LEFT;
				positionX 	= 180;
				positionY	= 150;
				healthX 	= 240;
			    healthY 	= 145;
			}else if(this.position === 'RIGHT'){
				sprite 		= SPRITE_RIGHT;
				positionX 	= 280;
				positionY	= 150;
				healthX 	= 340;
			    healthY 	= 145;
			}

			this.fnDrawSprites(sprite, positionX, positionY);

			this.fnDrawHealthBar(healthX, healthY);

		    if(this.iam){
		    	this.fnDrawYellowArrow();
		    }
		};

		Gambler.prototype.fnDrawHealthBar = function(healthX, healthY){
			this.graphicHealth 				= this.game.add.graphics(0, 0);
			this.graphicHealthBackground 	= this.game.add.graphics(0, 0);

			this.graphicHealth.beginFill(0x1EFF00);
			this.graphicHealthBackground.beginFill(0xFF0000);

			this.graphicHealthBackground.drawRect(healthX, healthY, HEALTH_SIZEX, HEALTH_SIZEY);

			this.game.world.bringToTop(this.graphicHealth);
			this.graphicHealth.drawRect(healthX, healthY, HEALTH_SIZEX, HEALTH_SIZEY);
			this.fnUpdateHealthBar(70);
		};

		Gambler.prototype.fnUpdateHealthBar = function(health){
			var healthX = this.graphicHealth.getBounds().x;
			var healthY = this.graphicHealth.getBounds().y;

			this.health = health;
			this.graphicHealth.clear();
			this.graphicHealth.drawRect(healthX, healthY, (HEALTH_SIZEX*this.health)/100, HEALTH_SIZEY);
		};

		Gambler.prototype.fnDrawSprites = function(sprite, positionX, positionY){
			// Configure attack sprite
			this.spriteAttack 	= this.fnAddSpriteToGame(sprite.ATTACK, positionX, positionY);
			// Scale according to desired size 
			// this.spriteAttack.scale.setTo(1.8, 1.8);
			// Add animation to attack
		    this.animAttack 	= this.spriteAttack.animations.add('attack');
		    this.animAttack.onComplete.add(function(){
		        this.spriteAttack.visible = false;
		        this.fnStartStandby();
		    }, this);

		    // Configure standby sprite
			this.spriteStandby 	= this.fnAddSpriteToGame(sprite.STANDBY, positionX, positionY);
			// standby.scale.setTo(2, 2);
		    this.animStandby 	= this.spriteStandby.animations.add('standby');		    

		    // Configure dying sprite
			this.spriteDying 	= this.fnAddSpriteToGame(sprite.DYING, positionX, positionY);
			this.animDying 		= this.spriteDying.animations.add('dying');
		};

		Gambler.prototype.fnDrawYellowArrow = function(){
			
		};

		Gambler.prototype.fnDying = function(){
			this.fnStopStandby();
			this.spriteDying.visible = true;
			this.animDying.play(10, false);	
		};
		
		Gambler.prototype.fnPreLoad = function(){
			var sprite = {};

			if(this.position === 'LEFT'){
				sprite = SPRITE_LEFT;
			}else if(this.position === 'RIGHT'){
				sprite = SPRITE_RIGHT;
			}

			this.fnPreLoadSprite(sprite.ATTACK);
		    this.fnPreLoadSprite(sprite.STANDBY);
		    this.fnPreLoadSprite(sprite.DYING);
		};	

		Gambler.prototype.fnPreLoadSprite = function(sprite){
			this.game.load.spritesheet(sprite.name, sprite.img, sprite.X, sprite.Y, sprite.maxFrame);
		};

		Gambler.prototype.fnStartStandby = function(){
			this.spriteStandby.visible = true;
			this.animStandby.play(2, true);
		};

		Gambler.prototype.fnStopStandby = function(){
		    this.spriteStandby.visible = false;
			this.animStandby.stop(true);
		};

		return Gambler;
	}
]);