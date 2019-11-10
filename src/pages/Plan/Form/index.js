import React, { useEffect, useState, useMemo } from 'react';

import { Form, Input } from '@rocketseat/unform';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { MdDone } from 'react-icons/md';
import * as Yup from 'yup';

import { Container, Row, Column } from '~/components/Grid';
import Title from '~/components/Title';
import { HeaderPage } from '~/components/HeaderPage/styles';
import { Controls } from '~/components/Controls/styles';

import ButtonLink from '~/components/ButtonLink';
import Button from '~/components/Button';

import colors from '~/styles/colors';
import { Panel } from '~/components/Panel/styles';
import Label from '~/components/Label';
import { FormGroup } from '~/components/FormGroup/styles';

import { plansSaveRequest } from '~/store/modules/plan/actions';
import api from '~/services/api';
import InputCurrency from '~/components/InputCurrency';
import { formatCurrency, formatCurrencyBR } from '~/util';

// import { Container } from './styles';

const schema = Yup.object().shape({
  title: Yup.string().required('O título do plano é obrigatório'),
  duration: Yup.number()
    .min(1, 'A duração dever ser no mínimo 1 mês')
    .max(60, 'A duração dever ser no máximo 60 meses')
    .required('A duração em meses é obrigatório'),
  price: Yup.string().required('O preço é obrigatório'),
  totalPrice: Yup.string(),
});

export default function PlanForm() {
  const dispath = useDispatch();
  const { id } = useParams();
  const [plan, setPlan] = useState({});

  const totalPrice = useMemo(() => {
    let total = 0.0;
    if (plan.duration && plan.price) {
      total = parseInt(plan.duration, 10) * formatCurrency(plan.price);
    }
    return formatCurrencyBR(total);
  }, [plan.duration, plan.price]);

  function handleSubmit(data) {
    dispath(plansSaveRequest({ ...data, id }));
    // resetForm();
  }

  useEffect(() => {
    if (id) {
      async function loadPlan() {
        const res = await api.get(`plans/${id}`);
        setPlan(res.data);
      }

      loadPlan();
    } else {
      setPlan({
        duration: 1,
        price: 0.0,
        total: 0.0,
      });
    }
  }, [id]);

  return (
    <Container>
      <HeaderPage>
        <Title>{id > 0 ? 'Edição de Plano' : 'Cadastro de Plano'}</Title>
        <Controls>
          <ButtonLink to="/planos" color={colors.second}>
            <MdArrowBack size={24} color="#fff" />
            <span>Voltar</span>
          </ButtonLink>
          <Button type="submit" form="formPlan">
            <MdDone size={24} color="#fff" />
            <span>Salvar</span>
          </Button>
        </Controls>
      </HeaderPage>

      <Panel>
        <Form
          id="formPlan"
          initialData={plan}
          schema={schema}
          onSubmit={handleSubmit}
        >
          <Input name="id" type="hidden" />
          <Label>TÍTULO DO PLANO</Label>
          <Input name="title" placeholder="Plano Ouro" />

          <Row>
            <Column mobile="12" desktop="4">
              <FormGroup>
                <Label>DURAÇÃO (em meses)</Label>
                <Input
                  type="number"
                  name="duration"
                  placeholder="12 meses"
                  onChange={e => setPlan({ ...plan, duration: e.target.value })}
                />
              </FormGroup>
            </Column>
            <Column mobile="12" desktop="4">
              <FormGroup>
                <Label>PREÇO MENSAL</Label>

                <InputCurrency
                  name="price"
                  placeholder="60,90"
                  setChange={e => setPlan({ ...plan, price: e })}
                />
              </FormGroup>
            </Column>
            <Column mobile="12" desktop="4">
              <FormGroup>
                <Label>PREÇO TOTAL</Label>
                <Input disabled name="totalPrice" value={totalPrice} />
              </FormGroup>
            </Column>
          </Row>

          {/* <MaskInput name="date" mask="99/99/9999" /> */}

          {/* <DatePicker name="date" options={{ format: 'yyyy-mm-dd' }} /> */}
          {/* 
          <ReactSelect
            name="tech"
            options={[
              { id: 'react', title: 'ReactJS' },
              { id: 'node', title: 'NodeJS' },
              { id: 'rn', title: 'React Native' },
            ]}
          /> */}
        </Form>
      </Panel>
    </Container>
  );
}
