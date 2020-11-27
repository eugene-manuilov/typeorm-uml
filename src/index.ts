import { TypeormUmlCommandFlags } from './TypeormUmlCommandFlags';
import { runCli } from './TypeormUml';

export async function run(
	configPath: string,
	flags: TypeormUmlCommandFlags = {
		connection: 'default',
		direction: 'TB',
		format: 'png',
		monochrome: false,
		handwritten: false,
		'with-enum-values': false,
	}
) {
	return runCli( configPath, flags );
}
