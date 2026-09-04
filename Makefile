types-to-openapi:
	npx tsp compile .

types-to-handlers:
	npx openapi-ts

types: types-to-openapi types-to-handlers