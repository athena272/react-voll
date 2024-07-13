import { useForm, Controller } from "react-hook-form";
import {
  Button,
  ErrorMessage,
  Fieldset,
  Form,
  FormContainer,
  Input,
  Label,
  Titulo,
} from "../../components";
import InputMask from "../../components/InputMask";
import { useEffect } from "react";

interface FormInputEndereco {
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  localidade: string;
}

const CadastroEndereco = () => {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    control,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormInputEndereco>({
    mode: 'all',
    defaultValues: {
      cep: "",
      rua: "",
      bairro: "",
      numero: "",
      localidade: "",
    },
  })

  useEffect(() => {
    reset();
  }, [reset, isSubmitSuccessful])

  const cepDigitado = watch('cep')

  const fetchEndereco = async (cep: string) => {
    if (!cep) {
      setError("cep", {
        type: "manual",
        message: "Cep inválido",
      });

      return
    }

    try {
      const response = await fetch(`http://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()

      if (response.ok) {
        setValue("rua", data.logradouro)
        setValue("localidade", `${data.localidade}, ${data.uf}`);
        setValue("bairro", data.bairro);
      } else {
        throw new Error("Cep inválido");
      }

      console.log(data)
    } catch (error) {
      console.log(error)
    }

  }

  const onSubmitForm = (data: FormInputEndereco) => {
    console.log(data)
  }

  return (
    <>
      <Titulo>Agora, mais alguns dados sobre você:</Titulo>
      <Form onSubmit={handleSubmit(onSubmitForm)}>
        <Controller
          name="cep"
          control={control}
          rules={{
            required: "O campo de CEP é obrigatório"
          }}
          render={({ field }) => (
            <Fieldset>
              <Label htmlFor="campo-cep">CEP</Label>
              <InputMask
                mask="99999-999"
                id="campo-cep"
                placeholder="Insira seu CEP"
                type="text"
                $error={!!errors.cep}
                onChange={field.onChange}
                onBlur={() => fetchEndereco(cepDigitado)}
              />
              {errors.cep &&
                <ErrorMessage>
                  {errors.cep.message}
                </ErrorMessage>
              }
            </Fieldset>
          )}
        />

        <Fieldset>
          <Label htmlFor="campo-rua">Rua</Label>
          <Input
            id="campo-rua"
            placeholder="Rua Agarikov"
            type="text"
            $error={!!errors.rua}
            {...register("rua", {
              required: "O campo de rua é obrigatório"
            })}
          />
          {errors.rua &&
            <ErrorMessage>
              {errors.rua.message}
            </ErrorMessage>
          }
        </Fieldset>

        <FormContainer>
          <Fieldset>
            <Label htmlFor="campo-numero-rua">Número</Label>
            <Input
              id="campo-numero-rua"
              placeholder="Ex: 1440"
              type="text"
              $error={!!errors.numero}
              {...register("numero", {
                required: "O campo de número é obrigatório"
              })}
            />
            {errors.numero &&
              <ErrorMessage>
                {errors.numero.message}
              </ErrorMessage>
            }
          </Fieldset>
          <Fieldset>
            <Label htmlFor="campo-bairro">Bairro</Label>
            <Input
              id="campo-bairro"
              placeholder="Vila Mariana"
              type="text"
              $error={!!errors.bairro}
              {...register("bairro", {
                required: "O campo de bairro é obrigatório"
              })}
            />
            {errors.bairro &&
              <ErrorMessage>
                {errors.bairro.message}
              </ErrorMessage>
            }
          </Fieldset>
        </FormContainer>
        <Fieldset>
          <Label htmlFor="campo-localidade">Localidade</Label>
          <Input
            id="campo-localidade"
            placeholder="São Paulo, SP"
            type="text"
            $error={!!errors.localidade}
            {...register("localidade", {
              required: "O campo de localidade é obrigatório"
            })}
          />
          {errors.localidade &&
            <ErrorMessage>
              {errors.localidade.message}
            </ErrorMessage>
          }
        </Fieldset>
        <Button type="submit">Cadastrar</Button>
      </Form>
    </>
  );
};

export default CadastroEndereco;
