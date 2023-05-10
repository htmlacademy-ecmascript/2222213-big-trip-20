function createEditDestinationTemplate(destination) {
  return /*html*/ `
  <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          <img class="event__photo" src="https://loremflickr.com/248/152?random=${crypto.randomUUID()}" alt="Event photo">
          <img class="event__photo" src="https://loremflickr.com/248/152?random=${crypto.randomUUID()}" alt="Event photo">
          <img class="event__photo" src="https://loremflickr.com/248/152?random=${crypto.randomUUID()}" alt="Event photo">
          <img class="event__photo" src="https://loremflickr.com/248/152?random=${crypto.randomUUID()}" alt="Event photo">
          <img class="event__photo" src="https://loremflickr.com/248/152?random=${crypto.randomUUID()}" alt="Event photo">
        </div>
       </div>
  </section>`;
}

export default createEditDestinationTemplate;
