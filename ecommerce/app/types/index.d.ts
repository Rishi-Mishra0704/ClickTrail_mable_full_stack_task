type User = {
    id: string;
    name: string;
    email: string;
    password?: string;
}

type GeneralResponse<T> = {
    data: T;
    message: string;
    success: boolean;
    error:unknown;

}

type SignupResponse = GeneralResponse<User>;

type SignupActionData = {
  error?: string;
};
