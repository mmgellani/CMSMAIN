import { required, minLength, email, sameAs } from 'vuelidate/lib/validators';
import { ValidationRuleset } from 'vuelidate';
import { ISignupOptions } from '../../../../../../../../ui/app/model';
import { complexity, registered } from '../../../../../../../../ui/app/validation';

export type TSignup = { signup: ISignupOptions, validationGroup: string[] };

export const validations: ValidationRuleset<TSignup> = {
    signup: {
        confirmPassword: {
            required,
            sameAsPassword: sameAs('password')
        },
        displayName: {
            required,
            minLength: minLength(2)
        },
        password: {
            required,
            complexity
        },
        userName: {
            required,
            email,
            registered
        }
    }
};