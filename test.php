<?
#1
echo (print('Hello '))?'Hello ':'World';

#2
class CArrayLikeObject implements ArrayAccess,IteratorAggregate{ 
	private $_data = array();
	
	public function __construct($initArray)
	{
		if (is_array($initArray)) {
			$this->_data = $initArray;
		} elseif(!empty($initArray)) {
			throw new Exception('CArrayLikeObject can be initialized only by array.');
		}	
	}
	
	/**
	* Implementation of ArrayAcces interface method
	* 
	* @param mixed $offset
	* @param mixed $value
	*/
	public function offsetSet($offset, $value) 
	{
		$this->_data[$offset] = $value;
	}

	/**
	* Implementation of ArrayAcces interface method
	* 
	* @param mixed $offset
	*/
	public function offsetExists($offset) 
	{
		return isset($this->_data[$offset]);
	}

	/**
	* Implementation of ArrayAcces interface method
	* 
	* @param mixed $offset
	*/
	public function offsetUnset($offset) 
	{
		unset($this->_data[$offset]);
	}

	/**
	* Implementation of ArrayAcces interface method
	* 
	* @param mixed $offset
	*/
	public function offsetGet($offset) 
	{
		return isset($this->_data[$offset]) ? $this->_data[$offset] : null;
	}
	
	/**
	*  @return array
	*/
	public function toArray() 
	{
		return $this->_data;	
	}
	
	/**
	* Implementation of IteratorAggregate interface method
	* 
	* @param mixed $offset
	*/
	public function getIterator() {
        return new ArrayIterator($this->_data);
    }
}

$arrayLike = new CArrayLikeObject(array('me'=>'test'));
foreach($arrayLike as $k=>$v){
	echo $v, ' ';
}
$arrayLike['test']='me';
$me=end($arrayLike->toArray());
echo $me;

