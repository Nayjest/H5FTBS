
// Универсальная функция наследования
Function.prototype.inheritsFrom = function(superClass) {
	var Inheritance = function(){};
	Inheritance.prototype = superClass.prototype;

	this.prototype = new Inheritance();
	this.prototype.constructor = this;
	this.superClass = superClass;
}

/*

//Ниже пример использования
// функция-конструктор класса
var Class = function(){}

// описание свойств и методов класса
Class.prototype.method = function(){};

// функция-конструктор подкласса
var ClassSub = function(){
	ClassSub.superClass.apply(this, arguments); //вызываем на себе конструктор предка
}
// определение наследования
ClassSub.inheritsFrom(Class); // sic!  

// описание свойств и методов подкласса
ClassSub.prototype.method = function(){ 
	ClassSub.superClass.prototype.method.apply(this, arguments);
}

*/