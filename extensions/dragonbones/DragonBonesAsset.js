/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var DragonBonesAsset = cc.Class({
    name: 'dragonBones.DragonBonesAsset',
    extends: cc.Asset,

    properties: {
        _dragonBonesJson : '',
        dragonBonesJson : {
            get: function () {
                return this._dragonBonesJson;
            },
            set: function (value) {
                this._dragonBonesJson = value;
                this.reset();
            }
        }
    },

    createNode: CC_EDITOR &&  function (callback) {
        var node = new cc.Node(this.name);
        var armatureDisplay = node.addComponent(dragonBones.ArmatureDisplay);
        armatureDisplay.dragonAsset = this;

        return callback(null, node);
    },

    reset : function() {
        if (CC_EDITOR) {
            this._dragonBonesDataCache = null;
            this._armaturesEnum = null;
        }
    },

    // EDITOR

    getRuntimeData: CC_EDITOR && function () {
        if (!this._dragonBonesDataCache) {
            var factory = new dragonBones.CCFactory();
            var jsonObj = JSON.parse(this._dragonBonesJson);
            this._dragonBonesDataCache = factory.parseDragonBonesData(jsonObj);
        }

        return this._dragonBonesDataCache;
    },

    getArmatureEnum: CC_EDITOR && function () {
        if (this._armaturesEnum) {
            return this._armaturesEnum;
        }
        var data = this.getRuntimeData();
        if (data) {
            var armatureNames = data.armatureNames;
            var enumDef = {};
            for (var i = 0; i < armatureNames.length; i++) {
                var name = armatureNames[i];
                enumDef[name] = i;
            }
            return this._armaturesEnum = cc.Enum(enumDef);
        }
        return null;
    },

    getAnimsEnum: CC_EDITOR && function (armatureName) {
        var data = this.getRuntimeData(true);
        if (data) {
            var armature = data.getArmature(armatureName);
            if (!armature) {
                return null;
            }

            var enumDef = { '<None>': 0 };
            var anims = armature.animations;
            var i = 0;
            for (var animName in anims) {
                if (anims.hasOwnProperty(animName)) {
                    enumDef[animName] = i + 1;
                    i++;
                }
            }
            return cc.Enum(enumDef);
        }
        return null;
    },
});

dragonBones.DragonBonesAsset = module.exports = DragonBonesAsset;
