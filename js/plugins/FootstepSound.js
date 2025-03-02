//=============================================================================
// FootstepSound.js
// Version: 1.0.0
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Play footstep sounds when you walk.
 * @url Twitch.tv/AngryMaximus
 * @AngryMaximus
 *
 * @help FootstepSound.js
 *
 * This plugin plays footstep sounds.
 *
 *
 * Terms of Use:
 * This plugin is free for non-commercial and commercial use.
 * Credit is required. Do not sell this plugin
 * or repost this plugin without my permission.
 */
(function() {
    var originalGamePlayer_initMembers = Game_Player.prototype.initMembers;
    Game_Player.prototype.initMembers = function() {
        originalGamePlayer_initMembers.call(this);
        this._footstepTimer = 0;
        this._footstepLeft = true; // start with left foot
        this._currentGroundType = 'default'; // cache current ground type
        this._terrainTag = null; // cache terrain tag of current tile
    };

    var originalGamePlayer_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(sceneActive) {
        originalGamePlayer_update.call(this, sceneActive);
        if (this._footstepTimer > 0) {
            this._footstepTimer--;
        }
        if (this._footstepTimer === 0 && this.isMoving()) {
            var footstepName = this._footstepLeft ? 'Footstep_Left' : 'Footstep_Right';
            var footstepVolume = 5;
            var footstepPitch = 130;
            var footstepPan = 0;
            if (this.isDashing()) {
                // double the footstep speed when dashing
                this._footstepTimer = 15;
            } else {
                this._footstepTimer = 20; // set timer to match walking speed
            }
            if (this._currentGroundType !== 'default') {
                footstepName += '_' + this._currentGroundType;
            }
            AudioManager.playSe({name: footstepName, volume: footstepVolume, pitch: footstepPitch, pan: footstepPan});
            this._footstepLeft = !this._footstepLeft; // alternate between left and right foot
        }
        this.updateGroundType(); // update current ground type and terrain tag
    };

    Game_Player.prototype.updateGroundType = function() {
        // Update the current ground type and terrain tag
        var x = $gameMap.roundX($gamePlayer.x);
        var y = $gameMap.roundY($gamePlayer.y);
        var terrainTag = $gameMap.terrainTag(x, y);
        if (terrainTag !== this._terrainTag) {
            this._terrainTag = terrainTag;
            this._currentGroundType = this.getGroundType(terrainTag);
        }
    };

    Game_Player.prototype.getGroundType = function(terrainTag) {
        // Return the ground type based on the terrain tag
        var groundTypes = {
            1: 'grass',
            2: 'dirt',
            3: 'stone',
            4: 'sand',
        };
        return groundTypes[terrainTag] || 'default';
    };
})();
