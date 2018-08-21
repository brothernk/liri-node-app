function Letter(character) {
    this.visible = !/[a-z1-9]/i.test(character);
    this.character = character;
}
  
Letter.prototype.toString = function() {
    if (this.visible === true) {
      return this.character;
    }
    return "_";
};
  
Letter.prototype.getSolution = function() {
    return this.character;
};
  
Letter.prototype.guess = function(characterGuess) {
    if (characterGuess.toUpperCase() === this.character.toUpperCase()) {
      this.visible = true;
      return true;
    }
    return false;
};
  
module.exports = Letter;