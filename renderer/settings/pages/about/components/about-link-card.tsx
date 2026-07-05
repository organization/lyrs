import { ExternalLink } from 'lucide-solid';

import Card from '../../../../components/Card';
import {
  AvatarImage,
  CardCaption,
  CardColumn,
  CardTitle,
  iconSmallProps,
  IconImage,
  Spacer,
} from '../../../components/setting-layout';

import type { JSX } from 'solid-js';

export interface AboutLinkCardProps {
  alt: string;
  image: string;
  title: JSX.Element;
  subtitle: JSX.Element;
  url: string;
  avatar?: boolean;
}

const ExternalIcon = () => <ExternalLink {...iconSmallProps} />;

const AboutLinkCard = (props: AboutLinkCardProps) => (
  <Card onClick={() => window.open(props.url)}>
    {props.avatar ? (
      <AvatarImage alt={props.alt} src={props.image} />
    ) : (
      <IconImage alt={props.alt} src={props.image} />
    )}
    <CardColumn>
      <CardTitle>{props.title}</CardTitle>
      <CardCaption>{props.subtitle}</CardCaption>
    </CardColumn>
    <Spacer />
    <ExternalIcon />
  </Card>
);

export default AboutLinkCard;
