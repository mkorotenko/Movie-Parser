import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numberToIterable', pure: false })
export class UINumberToIterablePipe implements PipeTransform {
	transform(value: number, args: any[] = null): any {
		return {
			*[Symbol.iterator]() {
				while (value > -1) {
					yield value--;
				}
			}
		};
	}
}
