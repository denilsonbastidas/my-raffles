import { Field, Form, Formik } from "formik";
import { Link } from "react-router-dom";
import PhoneInput from "react-phone-number-input";

interface SignUpType {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}
function SignUp() {
  const submitSignUpForm = (value: SignUpType) => {
    console.log(value);
  };
  return (
    <div className="min-h-[calc(100vh-69px)] md:flex md:items-center md:justify-center">
      <div className="mx-auto rounded-2xl w-full max-w-lg p-4 md:my-10 md:p-8 md:border border-gray-200">
        <h2 className="sign-text  text-4xl font-bold">Sign Up</h2>
        <div className="py-4 text-gray-500 text-base font-normal">
          Let's get started with your new account.
        </div>

        <Formik
          validateOnMount
          initialValues={{
            fullName: "",
            email: "",
            phone: "",
            password: "",
          }}
          onSubmit={submitSignUpForm}
        >
          {({ setFieldValue, handleChange, handleBlur, values }) => (
            <Form id="siginup-form" method="post">
              <label className="text-gray-500 text-base font-normal">
                Full Name
              </label>
              <Field type="text" name="fullName" className="input mb-2" />

              <label className="text-gray-500 text-base font-normal">
                Email
              </label>
              <Field type="email" name="email" className="input mb-2" />

              <label className="text-gray-500 text-base font-normal">
                Phone Number
              </label>

              <PhoneInput
                countrySelectProps={{ unicodeFlags: true }}
                defaultCountry="VE"
                international={false}
                name="phone"
                className="input mb-4"
                placeholder="Enter your phone"
                onChange={(e) => {
                  setFieldValue("phone", e);
                  e?.length && handleChange(e);
                }}
                value={values.phone}
                onBlur={(e) => handleBlur(e)}
              />

              <label className="text-gray-500 text-base font-normal">
                Password
              </label>
              <Field type="password" name="password" className="input mb-2" />

              <button
                className="mb-4 mt-2 w-full bg-gray-900 rounded-lg font-medium border-none p-3 text-center text-white"
                type="submit"
              >
                Get Started
              </button>
            </Form>
          )}
        </Formik>

        <div>
          <Link to="/signin">
            <div className="mt-8 text-gray-500">
              Already have an account?{" "}
              <span className="font-bold text-gray-900 hover:underline">
                Sign In
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default SignUp;
