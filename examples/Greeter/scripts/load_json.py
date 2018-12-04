import json

fileName = 'build/contracts/Greeter.json'

fileObject = open(fileName, 'r', encoding='utf8')
print('\n fileObject: ', fileObject)
print('\n type(fileObject): ', type(fileObject))

fileString = fileObject.read()
# print('\n fileString: ', fileString)
print('\n type(fileString): ', type(fileString))

# fileJson = json.load(fileObject)
fileJson = json.loads(fileString)
# fileJson = fileString
# print('\n fileJson: ', fileJson)
print('\n type(fileJson): ', type(fileJson))

contractName = fileJson['contractName']
print('\n contractName: ', contractName)

abi = fileJson['abi']
print('\n abi: ', abi)

bytecode = fileJson['bytecode']
print('\n bytecode: ', bytecode)
