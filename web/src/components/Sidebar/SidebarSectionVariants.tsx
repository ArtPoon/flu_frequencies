import React, { useMemo } from 'react'
import { Button, Col, Form, FormGroup, Row } from 'reactstrap'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import styled from 'styled-components'
import { CheckboxWithIcon } from 'src/components/Common/CheckboxWithIcon'
import { ColoredBox } from 'src/components/Common/ColoredBox'
import { fuzzySearch } from 'src/helpers/fuzzySearch'
import { useTranslationSafe } from 'src/helpers/useTranslationSafe'
import { Pathogen, useVariantsDataQuery, useVariantStyle } from 'src/io/getData'
import { variantsSearchTermAtom } from 'src/state/geography.state'
import { pathogenAtom } from 'src/state/pathogen.state'
import { variantAtom, variantsDisableAllAtom, variantsEnableAllAtom } from 'src/state/variants.state'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

export function SidebarSectionVariants() {
  const pathogen = useRecoilValue(pathogenAtom)
  const { variants } = useVariantsDataQuery(pathogen.name)
  const [searchTerm] = useRecoilState(variantsSearchTermAtom)
  const checkboxes = useMemo(
    () => fuzzySearch(variants, searchTerm).map(({ item }) => <VariantsCheckbox key={item} variant={item} />),
    [searchTerm, variants],
  )
  return (
    <Container>
      <VariantsSelectAll pathogen={pathogen} />
      <Form>{checkboxes}</Form>
    </Container>
  )
}

export interface VariantsSelectAllProps {
  pathogen: Pathogen
}

export function VariantsSelectAll({ pathogen }: VariantsSelectAllProps) {
  const { t } = useTranslationSafe()
  const selectAll = useSetRecoilState(variantsEnableAllAtom(pathogen.name))
  const deselectAll = useSetRecoilState(variantsDisableAllAtom(pathogen.name))
  return (
    <Row noGutters>
      <Col className="d-flex">
        <FormGroup className="flex-grow-0 mx-auto">
          <Button type="button" color="link" onClick={selectAll}>
            {t('Select all')}
          </Button>
          <Button type="button" color="link" onClick={deselectAll}>
            {t('Deselect all')}
          </Button>
        </FormGroup>
      </Col>
    </Row>
  )
}

export function VariantsCheckbox({ variant }: { variant: string }) {
  const { t } = useTranslationSafe()
  const pathogen = useRecoilValue(pathogenAtom)
  const { color } = useVariantStyle(pathogen.name, variant)
  const [variantEnabled, setVariantEnabled] = useRecoilState(variantAtom({ pathogen: pathogen.name, variant }))
  const Icon = useMemo(() => <ColoredBox $color={color} $size={16} />, [color])
  return <CheckboxWithIcon label={t(variant)} Icon={Icon} checked={variantEnabled} setChecked={setVariantEnabled} />
}