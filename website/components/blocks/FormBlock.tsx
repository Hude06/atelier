import type { FormBlock as FormBlockType } from '@/lib/types';
import { Container, Button } from '@/lib/ui';
import styles from './FormBlock.module.css';

export function FormBlock({ block }: { block: FormBlockType }) {
  return (
    <div className={styles.wrapper}>
      <Container>
        {block.heading && <h2 className={styles.heading}>{block.heading}</h2>}
        <form action={block.action ?? '/api/contact'} method="POST" className={styles.form}>
          {block.fields.map((field) => (
            <div key={field.name} className={styles.field}>
              <label htmlFor={field.name} className={styles.label}>
                {field.label}
                {field.required && <span className={styles.required}>*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  required={field.required}
                  placeholder={field.placeholder}
                  className={styles.textarea}
                />
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  placeholder={field.placeholder}
                  className={styles.input}
                />
              )}
            </div>
          ))}
          <Button type="submit" variant="primary" size="lg">
            {block.submitLabel ?? 'Submit'}
          </Button>
        </form>
      </Container>
    </div>
  );
}
