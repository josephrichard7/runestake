'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.factory(ApplicationConfiguration.factories.stakegame, [
	'$window',
	ApplicationConfiguration.factories.gamblergame,
	function($window, GamblerFactory) {
		
		/*jshint latedef: false*/
		function StakeGame(){
			this.game = new Phaser.Game(600, 400, Phaser.CANVAS, 'game', {
				preload: this.preload,
				create:  this.create
			});
			this.leftGambler 	= undefined;
			this.rightGambler	= undefined;
		}

		StakeGame.prototype.preload = function() {
		    this.game.load.baseURL 		= $window.location.protocol + '//' + $window.location.host;//'http://i.imgur.com/';
		    this.game.load.crossOrigin 	= 'anonymous';

 			this.game.load.image('background', '/modules/gamblermain/img/runestake_bg.png');

		    this.leftGambler 	= new GamblerFactory(this.game, 'LEFT');
		    this.rightGambler 	= new GamblerFactory(this.game, 'RIGHT');
		};

		StakeGame.prototype.create = function() {
			var background = this.game.add.sprite(0, 0, 'background');
			background.scale.setTo(0.5, 0.5);

			this.leftGambler.fnCreate();
			this.rightGambler.fnCreate();
			this.leftGambler.fnStartStandby();
			this.rightGambler.fnStartStandby();
		};

		StakeGame.prototype.fnHit = function(stakeHit){
			if(stakeHit.leftGamblerHitFirst){
				this.leftGambler.fnAttack();
				this.rightGambler.fnDrawHitReceived(stakeHit.amountHitReceivedRightGambler);
				this.rightGambler.fnUpdateHealthBar(stakeHit.rightGamblerHealth);
				if(this.rightGambler.health > 0){
					this.rightGambler.fnAttack();
					this.leftGambler.fnDrawHitReceived(stakeHit.amountHitReceivedLeftGambler);
					this.leftGambler.fnUpdateHealthBar(stakeHit.leftGamblerHealth);
				}else{
					this.rightGambler.fnDying();
				}
			}else{
				this.rightGambler.fnAttack(stakeHit.amountHitRightGambler);	
				if(this.leftGambler.health > 0){
					this.leftGambler.fnAttack(stakeHit.amountHitLeftGambler);
				}
			}
			
			this.leftGambler.fnUpdateHealthBar(stakeHit.leftGamblerHealth);
			this.rightGambler.fnUpdateHealthBar(stakeHit.rightGamblerHealth);
		};

		return StakeGame;
	}
]);