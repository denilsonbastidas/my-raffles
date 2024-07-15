import { Field, Formik, Form, ErrorMessage } from "formik";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SignInType } from "../../utils/types";
import * as Yup from "yup";
import { signIn } from "../../services";
import Skeleton from "react-loading-skeleton";

const signInValidationSchema = Yup.object().shape({
  phone: Yup.string()
    .test(
      "validatePhoneNumber",
      "Invalid phone number",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      (value: any) => Boolean(value.length) && isPossiblePhoneNumber(value)
    )
    .required("Phone Number is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

function SignIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const submitSignInForm = async (value: SignInType) => {
    try {
      setLoading(true);
      const responseSignIn = await signIn(value.phone, value.password);
      localStorage.setItem("token", responseSignIn.data.access_token);
      navigate("/dashboard");
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrorMessage(err.response.data.message);
      setLoading(false);
    }
  };
  return (
    <div className="min-h-[calc(100vh-69px)] md:flex md:items-center md:justify-center">
      <div className="mx-auto rounded-2xl w-full max-w-lg p-4 md:my-10 md:p-8 md:border border-gray-200">
        <h2 className="sign-text  text-4xl font-bold">Iniciar sesión</h2>
        <div className="py-4 text-gray-500 text-base font-normal">
          Bienvenido, introduce tus datos.
        </div>

        <Formik
          validateOnMount
          initialValues={{
            phone: "",
            password: "",
          }}
          validationSchema={signInValidationSchema}
          onSubmit={submitSignInForm}
        >
          {({ setFieldValue, handleChange, handleBlur, values }) => (
            <Form id="siginin-form" method="post">
              <label className="text-gray-500 text-base font-normal">
                Número de telefono
              </label>

              <PhoneInput
                countrySelectProps={{ unicodeFlags: true }}
                defaultCountry="VE"
                international={false}
                name="phone"
                className="input mb-4"
                placeholder="Ingrese su teléfono"
                onChange={(e) => {
                  setFieldValue("phone", e);
                  e?.length && handleChange(e);
                }}
                value={values.phone}
                onBlur={(e) => handleBlur(e)}
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="error-message"
              />
              <label className="text-gray-500 text-base font-normal">
                Contraseña
              </label>
              <Field type="password" name="password" className="input mb-2" />
              <ErrorMessage
                name="password"
                component="div"
                className="error-message"
              />
              <div className="flex justify-between">
                <div
                  aria-hidden="true"
                  className="my-2 cursor-pointer text-sm font-semibold text-gray-900"
                >
                  Has olvidado tu contraseña?
                </div>
              </div>

              {loading ? (
                <Skeleton height={45} />
              ) : (
                <button
                  className="mb-4 mt-2 w-full bg-gray-900 rounded-lg font-medium border-none p-3 text-center text-white"
                  type="submit"
                >
                  Iniciar de sesión
                </button>
              )}
              <div className="error-message">{errorMessage}</div>
            </Form>
          )}
        </Formik>

        <div>
          <Link to="/signup">
            <div className="mt-8 text-gray-500">
              No tienes una cuenta?{" "}
              <span className="font-bold text-gray-900 hover:underline">
                Registrate
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default SignIn;
