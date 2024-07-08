import { Field, Formik, Form } from "formik";
import { Link } from "react-router-dom";

interface SignInType {
  email: string;
  password: string;
}
function SignIn() {
  const submitSignInForm = (value: SignInType) => {
    console.log(value);
  };
  return (
    <div className="min-h-[calc(100vh-69px)] md:flex md:items-center md:justify-center">
      <div className="mx-auto rounded-2xl w-full max-w-lg p-4 md:my-10 md:p-8 md:border border-gray-200">
        <h2 className="sign-text  text-4xl font-bold">Sign In</h2>
        <div className="py-4 text-gray-500 text-base font-normal">
          Welcome back! Please enter your details.
        </div>

        <Formik
          validateOnMount
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={submitSignInForm}
        >
          {() => (
            <Form id="siginin-form" method="post">
              <label className="text-gray-500 text-base font-normal">
                Email
              </label>
              <Field type="email" name="email" className="input mb-2" />

              <label className="text-gray-500 text-base font-normal">
                Password
              </label>
              <Field type="password" name="password" className="input mb-2" />

              <div className="flex justify-between">
                <div
                  aria-hidden="true"
                  className="my-2 cursor-pointer text-sm font-semibold text-gray-900"
                >
                  Forgot password?
                </div>
              </div>

              <button
                className="mb-4 mt-2 w-full bg-gray-900 rounded-lg font-medium border-none p-3 text-center text-white"
                type="submit"
              >
                Sign In
              </button>
            </Form>
          )}
        </Formik>

        <div>
          <Link to="/signup">
            <div className="mt-8 text-gray-500">
              Don’t have an account?{" "}
              <span className="font-bold text-gray-900 hover:underline">
                Sign Up
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default SignIn;
