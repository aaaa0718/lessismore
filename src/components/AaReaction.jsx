import winterGirl from '../assets/aa-winter.webp';

export default function AaReaction() {
  return <span className="aa-reaction aa-reaction--peek" aria-hidden="true">
    <img className="aa-peek-portrait" src={winterGirl} width="546" height="900" alt="" />
    <span className="aa-peek-paper" />
  </span>;
}
