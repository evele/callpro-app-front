export function useDebouncedRef(value:string, delay = 300) {
    let timeout:ReturnType<typeof setTimeout>
    return customRef((track, trigger) => {
      return {
        get() {
          track()
          return value
        },
        set(newValue:string) {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            value = newValue
            trigger()
          }, delay)
        }
      }
    })
}

export const format_date_time = (time:string) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${time.slice(0, 5)}`;

    return formattedDate;
}

export const date_time_to_string = (time:StringOrNull = null) => {
    // Si time es null o undefined, usa la fecha y hora actual
    const dateObject = time ? new Date(time) : new Date();

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    const hours = String(dateObject.getHours()).padStart(2, '0');
    const minutes = String(dateObject.getMinutes()).padStart(2, '0');
    const seconds = String(dateObject.getSeconds()).padStart(2, '0');

    // se Construye la fecha formateada con la hora
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
}

export const format_number_to_show = function (number: string) {
  if (number.slice(0, 1) != "+") {
    return "(" + number.slice(0, 3) + ") " + number.slice(3, 6) + "-" + number.slice(6)
  }
  return number
}

export const show_full_name = (first_name: StringOrNull, last_name: StringOrNull) => {
  if(!first_name && !last_name) return '';
  if(!first_name) return last_name;
  if(!last_name) return first_name;
  return `${last_name}, ${first_name}`
}

export const format_contact_type = (type: OneToFour) => {
  switch (type) {
    case '1':
      return "Mobile";
    case '2':
      return "Office";
    case '3':
      return "Other";
    case '4':
      return "Home";
    default:
      return "";
  }
}